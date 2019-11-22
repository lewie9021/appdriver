const { configStore } = require("../stores/configStore");
const { commandLineService } = require("./services/commandLineService");
const { appiumService } = require("./services/appiumService");
const mocha = require("./mocha");

(async () => {
  // Parse CLI options.
  commandLineService.init();

  const specPaths = configStore.getSpecPaths();
  const device = configStore.getDevice();

  try {
    const session = await appiumService.createSession({ desiredCapabilities: device.capabilities });
    const failures = await mocha.runTestSpecs(specPaths, { timeout: 30 * 1000, fullStackTrace: true });
    await appiumService.endSession({ sessionId: session.sessionId });

    process.exitCode = (failures > 0) ? 1 : 0;
  } catch (err) {
    console.error(err);

    process.exitCode = 1;
  }
})();