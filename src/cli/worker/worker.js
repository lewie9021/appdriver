const yargs = require("yargs");
const mocha = require("./mocha");
const { appiumService } = require("../../services/appiumService");

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

  try {
    const session = await appiumService.createSession({ desiredCapabilities: capability });
    const failures = await mocha.runTestSpecs(capability, specFiles, { timeout: 30 * 1000, fullStackTrace: true });
    await appiumService.endSession({ sessionId: session.sessionId });

    process.exitCode = (failures > 0) ? 1 : 0;
  } catch (err) {
    console.error(err);

    process.exitCode = 1;
  }
})();