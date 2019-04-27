const { by } = require("./src/matchers");
const commands = require("./src/commands");
const gestures = require("./src/gestures");
const capabilities = require("./src/capabilities");
const { element } = require("./src/element");

(async () => {
  console.log("[1] Initialising session...");
  const { sessionId } = await commands.session.create(capabilities.iPhoneX);

  console.log("[2] Selecting element...");
  const $box = await element(by.label(sessionId, "list-screen"))
    .waitToExist(by.label(sessionId, "list-screen"));

  await commands.session.executeActions(sessionId, [gestures.swipeUp]);

  // const rect = await commands.session.getWindowRect(sessionId);
  // console.log("rect", rect);

  // const viewportDimensions = await commands.device.getViewportSize(sessionId);
  // console.log("[2] viewport dimensions", viewportDimensions);


  // const dimensions = await element(by.id(sessionId, "box"))
  //   .waitToExist(by.id(sessionId, "box"))
  //   .getSize(sessionId);
  //
  // console.log("[3] box dimensions", dimensions);
})();