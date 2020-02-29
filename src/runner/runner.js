const path = require("path");
const cp = require("child_process");
const { EventEmitter } = require("events");
const { configStore } = require("../stores/configStore");
const { commandLineService } = require("./services/commandLineService");
const { transformArgs } = require("../utils");

const retry = (func, maxRetries, retries = 0) => {
  return func(retries)
    .catch(() => {
      if (retries < maxRetries) {
        return retry(func, maxRetries, retries + 1);
      }

      throw new Error(`Failed after ${retries} retries`);
    });
};

(async () => {
  const events = new EventEmitter();

  try {
    // Parse CLI options.
    commandLineService.init();

    const reporters = configStore.getReporters();
    const maxDevices = configStore.getMaxDevices();
    const maxSpecRetries = configStore.getMaxSpecRetries();
    const devices = configStore.getDevices();
    let totalSpawned = 0;
    let currentlySpawned = 0;
    let failures = 0;

    const runWorker = (deviceIndex, specPath) => {
      return new Promise((resolve, reject) => {
        const device = configStore.getDevice(deviceIndex);
        const relativeSpecPath = path.relative(path.dirname(commandLineService.getConfigPath()), specPath);
        const worker = cp.fork(path.join(__dirname, "..", "worker", "worker.js"), transformArgs({
          config: commandLineService.getConfigPath(),
          spec: specPath,
          deviceIndex
        }));

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
            default: break;
          }
        });

        worker.on("close", (code) => {
          return code === 0
            ? resolve()
            : reject();
        });
      });
    };

    const runDeviceSpecs = (deviceIndex, specPaths) => {
      if (!specPaths.length) {
        return Promise.resolve();
      }

      const device = configStore.getDevice(deviceIndex);
      const relativeSpecPath = path.relative(path.dirname(commandLineService.getConfigPath()), specPaths[0]);

      const retryWorker = () => retry((count) => {
        if (count > 0) {
          events.emit("worker:retry", {
            device,
            specPath: relativeSpecPath,
            retries: count,
            maxRetries: maxSpecRetries
          });
        }

        return runWorker(deviceIndex, specPaths[0]);
      }, maxSpecRetries);

      return retryWorker()
        .then(() => events.emit("worker:passed", { device, specPath: relativeSpecPath }))
        .catch(() => {
          failures += 1;
          events.emit("worker:failed", { device, specPath: relativeSpecPath, maxRetries: maxSpecRetries });
        })
        .finally(() => runDeviceSpecs(deviceIndex, specPaths.slice(1)));
    };

    const runDevice = (deviceIndex) => {
      const specPaths = configStore.getSpecPaths(deviceIndex);
      const device = configStore.getDevice(deviceIndex);

      events.emit("device:started", { device });

      currentlySpawned += 1;
      totalSpawned += 1;

      return runDeviceSpecs(deviceIndex, specPaths)
        .then(() => {
          events.emit("device:finished", { device });

          currentlySpawned -= 1;

          if (totalSpawned < devices.length && currentlySpawned < maxDevices) {
            return runDevice(totalSpawned);
          }

          if (failures > 0) {
            process.exitCode = 1;
          }
        });
    };

    reporters.forEach((reporter) => reporter(events));

    events.emit("runner:started");

    let instances = [];
    for (let i = 0; i < Math.min(maxDevices, devices.length); i += 1) {
      instances.push(runDevice(i));
    }

    await Promise.all(instances);

    events.emit("runner:finished");
  } catch (err) {
    console.error(err);

    process.exitCode = 1;
  }
})();
