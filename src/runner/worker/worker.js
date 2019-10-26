const mocha = require("./mocha");
const commands = require("../../commands");
const { getConfig, getCapabilityName } = require("./utils");

const config = getConfig();

process.on("message", (action) => {
  console.log(`[Worker]`, "Got action:", action);
});

async function main() {
  const capability = config.capabilities[0];
  const name = getCapabilityName(capability);

  console.log(`[Worker]`, "Starting", name);

  const { sessionId } = await commands.session.create(capability);
  const failures = await mocha.runTestSpecs(config);
  await commands.session.end(sessionId);

  console.log(`[Worker]`, "Finished", name);

  process.exitCode = (failures > 0) ? 1 : 0;
}

main()
  .finally(() => {
    process.disconnect()
  });