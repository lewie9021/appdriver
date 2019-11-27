const path = require("path");
const cp = require("child_process");
const { EventEmitter } = require("events");
const { configStore } = require("../stores/configStore");
const { commandLineService } = require("./services/commandLineService");
const { transformArgs } = require("../utils");

(async () => {
  // Parse CLI options.
  commandLineService.init();

  const reporters = configStore.getReporters();
  const maxDevices = configStore.getMaxDevices();
  const devices = configStore.getDevices();
  const events = new EventEmitter();
  let totalSpawned = 0;
  let currentlySpawned = 0;
  let failures = 0;

  const runWorker = (deviceIndex, specPath) => {
    return new Promise((resolve) => {
      const device = configStore.getDevice(deviceIndex);
      const relativeSpecPath = path.relative(path.dirname(commandLineService.getConfigPath()), specPath);
      const worker = cp.fork(path.join(__dirname, "..", "worker", "worker.js"), transformArgs({
        config: commandLineService.getConfigPath(),
        spec: specPath,
        deviceIndex
      }));

      currentlySpawned += 1;
      totalSpawned += 1;

      events.emit("worker:started", { device, worker, specPath: relativeSpecPath });

      worker.on("message", ({ type, payload }) => {
        switch (type) {
          case "SPEC_STARTED":
            events.emit("spec:started", { ...payload, device, specPath: relativeSpecPath });
            break;
          case "TEST_STARTED":
            events.emit("test:started", { ...payload, device, specPath: relativeSpecPath });
            break;
          case "TEST_PASSED":
            events.emit("test:passed", { ...payload, device, specPath: relativeSpecPath });
            break;
          case "TEST_FAILED":
            events.emit("test:failed", { ...payload, device, specPath: relativeSpecPath });
            break;
          case "SPEC_FINISHED":
            events.emit("spec:finished", { ...payload, device, specPath: relativeSpecPath });
            break;
        }
      });

      worker.on("close", (code) => {
        currentlySpawned -= 1;

        if (code !== 0) {
          failures += 1;
        }

        events.emit("worker:finished", { device, specPath: relativeSpecPath, success: code === 0 });

        resolve();
      });
    });
  };

  const runDeviceSpecs = (deviceIndex, specPaths) => {
    if (!specPaths.length) {
      return Promise.resolve();
    }

    return runWorker(deviceIndex, specPaths[0])
      .then(() => runDeviceSpecs(deviceIndex, specPaths.slice(1)));
  };

  const runDevice = (deviceIndex) => {
    const specPaths = configStore.getSpecPaths(deviceIndex);
    const device = configStore.getDevice(deviceIndex);

    events.emit("device:started", { device });

    return runDeviceSpecs(deviceIndex, specPaths)
      .then(() => {
        events.emit("device:finished", { device });

        if (totalSpawned < devices.length && currentlySpawned < maxDevices) {
          return runDevice(totalSpawned);
        }

        if (failures > 0) {
          process.exitCode = 1;
        }
      });
  };

  reporters.forEach((reporter) => reporter(events));

  for (let i = 0; i < Math.min(maxDevices, devices.length); i += 1) {
    runDevice(i);
  }
})();