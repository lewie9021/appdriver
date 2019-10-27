const path = require("path");
const cp = require("child_process");
const { transformArgs } = require("./utils");
const reporter = require("./reporters/simpleReporter");

function init({ config }) {
  if (config.capabilities.length > 4) {
    throw new Error("More than 4 works not supported, yet");
  }

  let workers = [];

  config.capabilities.forEach((capability) => {
    const worker = spawnWorker(capability, config.specs);

    workers.push({ capability, worker });
  });

  reporter(workers);
}

function spawnWorker(capability, specFiles) {
  const processArgs = transformArgs({
    capability: JSON.stringify(capability),
    specFiles: JSON.stringify(specFiles)
  });
  const worker = cp.fork(path.join(__dirname, "worker", "worker.js"), processArgs, { silent: true });

  worker.on("close", (code) => {
    // TODO: Should take into account all counts from all workers.
    if (code !== 0) {
      process.exitCode = code;
    }
  });

  return worker;
}

module.exports = {
  init,
  spawnWorker
};