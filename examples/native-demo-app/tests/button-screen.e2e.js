const { by, element, expect } = require("../../../index");

describe("Button Screen", () => {
  let $screen;

  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-button-screen")).tap();
    $screen = await element(by.label("button-screen")).waitToBeVisible();
  });

  it("works", async () => {
    const $button = await $screen.findElement(by.label("button"));

    await expect($button.getText()).toEqual("Press Me!");
  });
});