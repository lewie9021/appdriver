const { element, by, alert, expect } = require("appdriver");

describe("My First Testing App", () => {
  it("displays 'Hello World!' when the button is tapped", async () => {
    await element(by.label("button")).tap();
    await alert.waitToBeVisible();
    await expect(alert).toHaveText("Hello World!");
  });
});