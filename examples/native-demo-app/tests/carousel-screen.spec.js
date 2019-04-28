const { by, element, device, commands } = require("../../../index");
const gestures = require("../../../src/gestures");
const capabilities = require("../config/capabilities");

describe("Carousel Screen", () => {
  const screenTestId = "carousel-screen";

  before(() => commands.session.create(capabilities.iPhoneX));

  it("works", async () => {
    console.log("[1] Waiting for screen to load...");
    await element(by.label(screenTestId)).waitToExist(by.label(screenTestId));

    const viewport = await device.getViewport();
    console.log("[2] viewport dimensions", viewport);

    const swipeLeft = gestures.swipeLeft({
      x: viewport.width * 0.75,
      y: viewport.height / 2,
      distance: viewport.width * 0.75,
    });

    console.log("[3] Swiping to next page...");
    await device.performGesture([swipeLeft]);

    console.log("[4] Swiping to next page...");
    await device.performGesture([swipeLeft]);
  });
});