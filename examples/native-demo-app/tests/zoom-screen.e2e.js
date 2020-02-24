const { by, element, device, gestures } = require("../../../index");

describe("Zoom Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-zoom-screen")).tap();
    await element(by.label("zoom-screen")).waitToBeVisible();
  });

  it("supports spread gesture", async () => {
    const $image = element(by.label("image"));

    const location = await $image.getLocation({ relative: true });
    const { width, height } = await $image.getSize();
    const x = Math.round(location.x + (width / 2));
    const y = Math.round(location.y + (height / 2));

    await device.performGesture(gestures.spread({ x, y, distance: 10 }));
    await device.wait(3000);
  });

  it("supports pinch gesture", async () => {
    const $image = element(by.label("image"));

    const location = await $image.getLocation({ relative: true });
    const { width, height } = await $image.getSize();
    const x = Math.round(location.x + (width / 2));
    const y = Math.round(location.y + (height / 2));

    await device.performGesture(gestures.pinch({ x, y, distance: 10 }));
    await device.wait(3000);
  });
});