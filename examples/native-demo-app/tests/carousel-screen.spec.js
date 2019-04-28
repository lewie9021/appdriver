const { by, element, device, commands } = require("../../../index");
const gestures = require("../../../src/gestures");
const capabilities = require("../config/capabilities");

(async () => {
  console.log("[1] Initialising session...");
  const session = await commands.session.create(capabilities.iPhoneX);

  console.log("[2] Waiting for screen to load...");
  const testId = "carousel-screen";
  const $screen = await element(by.label(testId)).waitToExist(by.label(testId));

  const screenSize = await $screen.getSize();

  console.log("screenSize:", screenSize);


  const viewport = await device.getViewport();
  console.log("[3] viewport dimensions", viewport);

  const swipeLeft = gestures.swipeLeft({
    // x: 250,
    // y: 250,
    // distance: 250
    x: viewport.width * 0.75,
    y: viewport.height / 2,
    distance: viewport.width * 0.75,
  });

  console.log("[4] Swiping to next page...");
  await device.performGesture([swipeLeft]);

  console.log("[5] Swiping to next page...");
  await device.performGesture([swipeLeft]);
})();