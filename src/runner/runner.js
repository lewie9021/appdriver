const cp = require("child_process");
const path = require("path");
const { transformArgs } = require("./utils");

function spawnWorker(configPath) {
  const processArgs = transformArgs({ configPath });
  const worker = cp.fork(path.join(__dirname, "worker", "worker.js"), processArgs);

  worker.on("message", (action) => {
    console.log("[Main]", "Got action:", action);
  });

  worker.on("close", (code) => {
    console.log("[Main]", `Worker closed`);

    // TODO: Should take into account all counts from all workers.
    if (code !== 0) {
      process.exitCode = code;
    }
  });
}

module.exports = {
  spawnWorker
};