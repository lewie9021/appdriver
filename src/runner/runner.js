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

  const runDevice = (device, index) => {
    const worker = cp.fork(path.join(__dirname, "..", "worker", "worker.js"), transformArgs({
      config: commandLineService.getConfigPath(),
      deviceIndex: index
    }));

    currentlySpawned += 1;
    totalSpawned += 1;

    events.emit("worker:started", { device, worker });

    worker.on("message", ({ type, payload }) => {
      switch (type) {
        case "FRAMEWORK_START":
          events.emit("framework:start", { ...payload, device });
          break;
        case "TEST_START":
          events.emit("test:start", { ...payload, device });
          break;
        case "TEST_PASSED":
          events.emit("test:passed", { ...payload, device });
          break;
        case "TEST_FAILED":
          events.emit("test:failed", { ...payload, device });
          break;
      }
    });

    worker.on("close", (code) => {
      currentlySpawned -= 1;

      events.emit("worker:finished", { device, success: code === 0 });

      if (totalSpawned < devices.length && currentlySpawned < maxDevices) {
        runDevice(devices[totalSpawned], totalSpawned);
      }

      // If any workers fail to close gracefully, consider the run a failure.
      if (code !== 0) {
        process.exitCode = 1;
      }
    });
  };

  reporters.forEach((reporter) => reporter(events));

  for (let i = 0; i < Math.min(maxDevices, devices.length); i += 1) {
    runDevice(devices[i], i);
  }
})();