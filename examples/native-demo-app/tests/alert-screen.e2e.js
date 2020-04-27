const { by, alert, element, expect } = require("../../../main");

describe("Alert Screen", () => {
  before(async () => {
    await element(by.label("list-item-alert-screen")).tap();
  });

  it("supports retrieving alert text", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("alert-button")).tap();

    await alert.waitToBeVisible();

    await expect(alert).toHaveText([
      "Alert",
      "Hello World!"
    ].join("\n"));

    return alert.dismiss();
  });

  it("supports accepting alerts", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("confirm-alert-button")).tap();

    await alert.waitToBeVisible();

    await alert.accept();

    await alert.waitToBeVisible();

    return alert.dismiss();
  });

  it("supports cancelling alerts", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("confirm-alert-button")).tap();

    await alert.waitToBeVisible();

    await alert.dismiss();

    await alert.waitToBeVisible();

    return alert.dismiss();
  });
});