const { by, element, device, alert, expect } = require("../../../main");

describe("Form Screen", () => {
  before(async () => {
    await element(by.label("list-item-form-screen")).tap();
  });

  it("supports text input", async () => {
    const $screen = await element(by.label("form-screen"));
    const $textInput = await $screen.findElement(by.label("text-input"));
    const text = "Hello World!";

    await expect($textInput).toHaveValue("");

    await $textInput.setValue(text);

    await expect($textInput).toHaveValue(text);
  });

  it("supports clearing text", async () => {
    const $screen = await element(by.label("form-screen"));
    const $textInput = await $screen.findElement(by.label("text-input"));

    await $textInput.clearText();

    await expect($textInput).toHaveValue("");
  });

  it("supports sliders", async () => {
    const $screen = await element(by.label("form-screen"));
    const $slider = await $screen.findElement(by.label("slider-input"), { sliderRange: [ 0, 10 ]});

    await $slider.setValue(10);
    await expect($slider).toHaveValue(10);

    await $slider.setValue(0);
    await expect($slider).toHaveValue(0);
  });

  it("supports switches", async () => {
    const $screen = await element(by.label("form-screen"));
    const $switch = await $screen.findElement(by.label("switch"));

    await expect($switch).toHaveValue(false);

    await $switch.tap();

    await expect($switch).toHaveValue(true);
  });

  it("supports the tap gesture", async () => {
    const $screen = await element(by.label("form-screen"));
    const $button = await $screen.findElement(by.label("button"));

    await $button.tap();

    await alert.waitToBeVisible();
    await alert.accept();
  });

  it("supports the long press gesture", async () => {
    const $screen = await element(by.label("form-screen"));
    const $button = await $screen.findElement(by.label("button"));

    await $button.longPress();

    await alert.waitToBeVisible();
    await alert.accept();
  });
});