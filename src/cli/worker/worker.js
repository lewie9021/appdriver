const yargs = require("yargs");
const mocha = require("./mocha");
const commands = require("../../commands");

const params = yargs
  .option("capability", {
    describe:  "Capability object found within the configuration file",
    demandOption: true,
    type: "string",
    coerce: JSON.parse
  })
  .option("specFiles", {
    describe:  "List of spec paths within the configuration file",
    demandOption: true,
    type: "string",
    coerce: JSON.parse
  })
  .argv;

(async () => {
  const { capability, specFiles } = params;
  const session = await commands.session.create(capability);
  const failures = await mocha.runTestSpecs(capability, specFiles, { timeout: 30 * 1000 });
  await commands.session.end(session.sessionId);

  process.exitCode = (failures > 0) ? 1 : 0;
})();