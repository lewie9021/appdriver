const { by, element, expect } = require("../../../index");

describe("Button Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-button-screen")).tap();
    await element(by.label("button-screen")).waitToBeVisible();
  });

  it("works", async () => {
    const $button = await element(by.label("button"));
    const $text = await element(by.label("text"));

    await expect($button).toHaveText("Press Me!");
    await expect($text).toHaveText("Hello World");
  });
});