const { by, element, device, gestures, expect } = require("../../../index");

describe("Form Screen", () => {

  before(async () => {
    await element(by.label("form-screen")).waitToBeVisible();
  });

  it("supports text input", async () => {
    const $element = await element(by.label("text-input"))
      .tap()
      .typeText("Hello World!");

    await expect($element).toHaveValue("Hello World!");
  });

  it("supports clearing text", async () => {
    const $element = await element(by.label("text-input")).clearText();

    await expect($element).toHaveValue(null);
  });

  it("supports sliders", async () => {
    const $slider = await element(by.label("slider-input"));
    const size = await $slider.getSize();
    const location = await $slider.getLocation({relative: true});

    await device.performGesture(
      gestures.swipeRight({
        x: location.x,
        y: location.y,
        distance: size.width / 2
      })
    );
  });

  it("supports the tap gesture", async () => {
    await element(by.label("button")).tap();

    await device.wait({duration: 200});

    await element(by.label("OK")).tap();
  });

  it("supports the long press gesture", async () => {
    await element(by.label("button"))
      .waitToBeVisible()
      .longPress();

    await device.wait({duration: 200});

    await element(by.label("OK")).tap();
  });
});