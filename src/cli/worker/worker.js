const yargs = require("yargs");
const mocha = require("./mocha");
const { sessionStore } = require("../../stores/sessionStore");
const { createAppiumService } = require("../../services/appiumService");

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

const appiumService = createAppiumService(sessionStore);

(async () => {
  const { capability, specFiles } = params;
  const session = await appiumService.createSession({ desiredCapabilities: capability });
  const failures = await mocha.runTestSpecs(capability, specFiles, { timeout: 30 * 1000 });
  await appiumService.endSession({ sessionId: session.sessionId });

  process.exitCode = (failures > 0) ? 1 : 0;
})();