const { by, element, device, gestures, expect } = require("../../../index");

describe("Form Screen", () => {
  const screenTestId = "form-screen";

  it("works", async () => {
    console.log("[1] Waiting for screen to load...");
    await element(by.label(screenTestId)).waitToBeVisible();

    console.log("[2] Inputting Text...");
    const $element = await element(by.label("text-input"))
      .tap()
      .typeText("Hello World!");

    await expect($element).toHaveValue("Hello World!");

    console.log("[3] Clearing Text...");
    $element.clearText();

    const $slider = await element(by.label("slider-input"));
    const size = await $slider.getSize();
    const location = await $slider.getLocation({relative: true});

    console.log("[4] Swiping slider...");
    await device.performGesture(
      gestures.swipeRight({
        x: location.x,
        y: location.y,
        distance: size.width / 2
      })
    );

    console.log("[5] Long press...");
    await element(by.label("button")).longPress();
  });
});