const path = require("path");
const cp = require("child_process");
const { transformArgs, getCapabilityName } = require("./utils");

function init({ config }) {
  if (config.capabilities.length > 4) {
    throw new Error("More than 4 works not supported, yet");
  }

  config.capabilities.forEach((capability) => {
    spawnWorker(capability, config.specs);
  });
}

function spawnWorker(capability, specFiles) {
  const processArgs = transformArgs({
    capability: JSON.stringify(capability),
    specFiles: JSON.stringify(specFiles)
  });
  const name = getCapabilityName(capability);
  const worker = cp.fork(path.join(__dirname, "worker", "worker.js"), processArgs, { silent: true });

  console.log("Started", name);

  worker.on("message", (message) => {
    console.log("Received message:", message);
  });

  worker.on("close", (code) => {
    console.log("Worker closed with exit code:", code);

    // TODO: Should take into account all counts from all workers.
    if (code !== 0) {
      process.exitCode = code;
    }
  });
}

module.exports = {
  init,
  spawnWorker
};