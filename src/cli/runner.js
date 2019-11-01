const path = require("path");
const cp = require("child_process");
const { EventEmitter } = require("events");
const { transformArgs } = require("./utils");
const simpleReporter = require("./reporters/simpleReporter");

function runWorker(args) {
  return cp.fork(path.join(__dirname, "worker", "worker.js"), transformArgs(args), { silent: true });
}

function init({ config }) {
  const { maxInstances, capabilities, specs } = config;
  const events = new EventEmitter();
  let totalSpawned = 0;
  let currentlySpawned = 0;

  const runTestInstance = (capability, specFiles) => {
    const worker = runWorker({
      capability: JSON.stringify(capability),
      specFiles: JSON.stringify(specFiles)
    });

    currentlySpawned += 1;
    totalSpawned += 1;

    events.emit("worker:started", { capability, worker });

    worker.on("message", ({ type, payload }) => {
      switch (type) {
        case "FRAMEWORK_START":
          events.emit("framework:start", { ...payload, capability });
          break;
        case "TEST_START":
          events.emit("test:start", { ...payload, capability });
          break;
        case "TEST_PASSED":
          events.emit("test:passed", { ...payload, capability });
          break;
        case "TEST_FAILED":
          events.emit("test:failed", { ...payload, capability });
          break;
      }
    });

    worker.on("close", (code) => {
      currentlySpawned -= 1;

      events.emit("worker:finished", { capability, success: code === 0 });

      if (totalSpawned < capabilities.length && currentlySpawned < maxInstances) {
        runTestInstance(capabilities[totalSpawned], specs);
      }

      // If any workers fail to close gracefully, consider the run a failure.
      if (code !== 0) {
        process.exitCode = 1;
      }
    });
  };

  simpleReporter(events);

  for (let i = 0; i < Math.min(maxInstances, capabilities.length); i += 1) {
    runTestInstance(capabilities[i], specs);
  }
}

module.exports = {
  init
};