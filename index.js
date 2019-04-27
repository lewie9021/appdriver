const { by } = require("./src/matchers");
const commands = require("./src/commands");
const device = require("./src/device");
const gestures = require("./src/gestures");
const capabilities = require("./src/capabilities");
const { element } = require("./src/element");

(async () => {
  console.log("[1] Initialising session...");
  const { sessionId } = await commands.session.create(capabilities.iPhoneX);

  console.log("[2] Selecting element...");
  const testId = "carousel-screen";
  await element(by.label(sessionId, testId))
    .waitToExist(by.label(sessionId, testId));

  const viewport = await device.getViewport(sessionId);
  console.log("[3] viewport dimensions", viewport);

  const swipeLeft = gestures.swipeLeft({
    x: viewport.width * 0.75,
    y: viewport.height / 2,
    distance: viewport.width * 0.75,
  });

  await device.performGesture(sessionId, [swipeLeft]);
  await device.performGesture(sessionId, [swipeLeft]);

  // const dimensions = await element(by.id(sessionId, "box"))
  //   .waitToExist(by.id(sessionId, "box"))
  //   .getSize(sessionId);
  //
  // console.log("[3] box dimensions", dimensions);
})();