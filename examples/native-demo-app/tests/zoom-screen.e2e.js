const { by, element, device, gestures } = require("../../../main");

describe("Zoom Screen", () => {
  before(async () => {
    await element(by.label("list-item-zoom-screen")).tap();
  });

  it("supports spread gesture", async () => {
    const $screen = await element(by.label("zoom-screen"));
    const $image = $screen.findElement(by.label("image"));

    const location = await $image.getLocation({ relative: true });
    const { width, height } = await $image.getSize();
    const x = Math.round(location.x + (width / 2));
    const y = Math.round(location.y + (height / 2));
    const distance = device.platform.name === "iOS" ? 10 : 400;

    await device.performGesture(gestures.spread({ x, y, distance }));
    await device.wait(3000);
  });

  it("supports pinch gesture", async () => {
    const $screen = await element(by.label("zoom-screen"));
    const $image = $screen.findElement(by.label("image"));

    const location = await $image.getLocation({ relative: true });
    const { width, height } = await $image.getSize();
    const x = Math.round(location.x + (width / 2));
    const y = Math.round(location.y + (height / 2));
    const distance = device.platform.name === "iOS" ? 10 : 400;

    await device.performGesture(gestures.pinch({ x, y, distance }));
    await device.wait(3000);
  });
});