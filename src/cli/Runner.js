const path = require("path");
const cp = require("child_process");
const { EventEmitter } = require("events");
const { transformArgs } = require("./utils");
const simpleReporter = require("./reporters/simpleReporter");

function runWorker(args) {
  return cp.fork(path.join(__dirname, "worker", "worker.js"), transformArgs(args), { silent: true });
}

class Runner {
  constructor({ config }) {
    this.config = config;

    this.init();
  }

  init() {
    const { maxInstances, capabilities, specs } = this.config;
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

      events.emit("worker:start", { capability, worker });

      worker.on("message", ({ type, payload }) => {
        switch (type) {
          case "TEST_SETUP":
            events.emit("test:setup", { capability });
            break;
          case "TEST_START":
            events.emit("test:start", { capability, name: payload.name });
            break;
          case "TEST_PASSED":
            events.emit("test:passed", { capability, name: payload.name, duration: payload.duration });
            break;
          case "TEST_FAILED":
            events.emit("test:failed", { capability, name: payload.name, duration: payload.duration });
            break;
        }
      });

      worker.on("close", () => {
        currentlySpawned -= 1;

        events.emit("worker:finish", { capability });

        if (totalSpawned < capabilities.length && currentlySpawned < maxInstances) {
          runTestInstance(capabilities[totalSpawned], specs);
        }
      });
    };

    simpleReporter(events);

    for (let i = 0; i < Math.min(maxInstances, capabilities.length); i += 1) {
      runTestInstance(capabilities[i], specs);
    }
  }
}

module.exports = Runner;