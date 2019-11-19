const { by, element, device, gestures, expect } = require("../../../index");

describe("Form Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-form-screen")).tap();
    await element(by.label("form-screen")).waitToBeVisible();
  });

  it("supports text input", async () => {
    await expect(element(by.label("text-input"))).toHaveValue("");

    const $textInput = await element(by.label("text-input"))
      .tap()
      .typeText("Hello World!");

    await expect($textInput).toHaveValue("Hello World!");
  });

  it("supports clearing text", async () => {
    const $element = await element(by.label("text-input")).clearText();

    await expect($element).toHaveValue("");
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

    await expect(element(by.label("slider-input"))).toHaveValue(5, {sliderRange: [0, 10]});
  });

  it("supports switches", async () => {
    const $switch = await element(by.label("switch"));

    await expect($switch).toHaveValue(false);

    await $switch.tap();

    await expect($switch).toHaveValue(true);
  });

  it("supports the tap gesture", async () => {
    await element(by.label("button")).tap();

    await element(by.text("OK"))
      .waitToBeVisible()
      .tap();
  });

  it("supports the long press gesture", async () => {
    await element(by.label("button"))
      .waitToBeVisible()
      .longPress();

    await device.wait(200);

    await element(by.text("OK")).tap();
  });
});