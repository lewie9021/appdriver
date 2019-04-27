const { by } = require("./src/matchers");
const commands = require("./src/commands");
const device = require("./src/device");
const gestures = require("./src/gestures");
const capabilities = require("./src/capabilities");
const { element } = require("./src/element");

(async () => {
  console.log("[1] Initialising session...");
  const session = await commands.session.create(capabilities.iPhoneX);

  console.log("[2] Selecting element...");
  const testId = "carousel-screen";
  await element(by.label(testId))
    .waitToExist(by.label(testId));

  const viewport = await device.getViewport();
  console.log("[3] viewport dimensions", viewport);

  const swipeLeft = gestures.swipeLeft({
    x: viewport.width * 0.75,
    y: viewport.height / 2,
    distance: viewport.width * 0.75,
  });

  await device.performGesture([swipeLeft]);
  await device.performGesture([swipeLeft]);

  // await device.restartApp(capabilities.iPhoneX);
  // await device.resetApp(capabilities.iPhoneX);

  // const dimensions = await element(by.id("box"))
  //   .waitToExist(by.id("box"))
  //   .getSize();
  //
  // console.log("[3] box dimensions", dimensions);
})();