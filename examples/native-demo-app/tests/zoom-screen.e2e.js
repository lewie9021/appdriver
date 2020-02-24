const { by, element, device, expect, appiumService } = require("../../../index");

describe("Zoom Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-zoom-screen")).tap();
    await element(by.label("zoom-screen")).waitToBeVisible();
  });


  it("works", async () => {
    const $image = element(by.label("image"));

    const location = await $image.getLocation({ relative: true });
    const { width, height } = await $image.getSize();

    const centerPoint = { x: Math.round(location.x + (width / 2)), y: Math.round(location.y + (height / 2)) };

    const swipeLeft = {
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", ...centerPoint},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: -10, y: 0},
        {type: "pointerUp", button: 0}
      ]
    };

    const swipeRight = {
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", ...centerPoint},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 10, y: 0},
        {type: "pointerUp", button: 0}
      ]
    };

    await appiumService.performActions({
      actions: [
        swipeLeft,
        swipeRight
      ]
    });

    await device.wait(3000);
  });
});