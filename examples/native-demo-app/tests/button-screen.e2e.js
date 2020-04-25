const { by, element, expect } = require("../../../main");

describe("Button Screen", () => {
  before(async () => {
    await element(by.label("list-item-button-screen")).tap();
    await element(by.label("button-screen")).waitToBeVisible();
  });

  // Note: Nested TextViews on Android don't seem to happen anymore. Previously RN v0.59.x and Appium v1.11.x did.
  it("works", async () => {
    const $screen = await element(by.label("button-screen"));
    const $button = await $screen.findElement(by.label("button"));

    await expect($button).toHaveText("Press Me!", { recursive: true });
  });
});