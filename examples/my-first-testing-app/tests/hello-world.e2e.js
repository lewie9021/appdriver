const { element, by, expect } = require("appdriver");

describe("My First Testing App", () => {
  it("displays 'Hello World!' when the button is tapped", async () => {
    await element(by.label("button"))
      .waitToBeVisible()
      .tap();

    const $alert = await element(by.label("message")).waitToBeVisible();

    await expect($alert).toHaveText("Hello World!");
  });
});