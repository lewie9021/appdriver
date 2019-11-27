const { by, element, expect } = require("../../../index");

describe("Button Screen", () => {
  let $screen;

  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-button-screen")).tap();
    await element(by.label("menu-screen")).waitToBeInvisible();
    $screen = await element(by.label("button-screen")).waitToBeVisible();
  });

  // Note: Nested TextViews on Android don't seem to happen anymore. Previously RN v0.59.x and Appium v1.11.x did.
  it("works", async () => {
    const $button = await $screen.findElement(by.label("button"));

    await expect($button.getText()).toEqual("Press Me!");
  });
});