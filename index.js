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

  console.log("[2] Selecting element...");
  const $searchInput = await element(by.id(sessionId, "search-input"))
    // .waitToBeVisible()
    .waitToExist(by.id(sessionId, "search-input"))
    .tap();

  console.log("[3] $searchInput", $searchInput);
})();