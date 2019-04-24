const { by } = require("./src/matchers");
const commands = require("./src/commands");
const { element } = require("./src/element");

(async () => {
  console.log("[1] Initialising session...");
  const { sessionId } = await commands.session.create({
    "app": "../NativeDemoApp/ios/build/NativeDemoApp/Build/Products/Debug-iphonesimulator/NativeDemoApp.app",
    "platformName": "iOS",
    "platformVersion": "12.1",
    "deviceName": "iPhone X",
    "automationName": "XCUITest",
    "wdaLocalPort": 8100,
    "waitForQuiescence": false
  });

  // const viewportDimensions = await commands.device.getViewportSize(sessionId);
  // console.log("[2] viewport dimensions", viewportDimensions);

  console.log("[2] Selecting element...");
  const dimensions = await element(by.id(sessionId, "box"))
    .waitToExist(by.id(sessionId, "box"))
    .getSize(sessionId);

  console.log("[3] box dimensions", dimensions);
})();