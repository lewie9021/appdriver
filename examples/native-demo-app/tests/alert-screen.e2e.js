const { by, alert, device, element, expect } = require("../../../main");

describe("Alert Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-alert-screen")).tap();
    await element(by.label("alert-screen")).waitToBeVisible();
  });

  afterEach(() => alert.dismiss());

  it("supports retrieving alert text", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("alert-button")).tap();

    await device.waitFor(() => expect(alert.isVisible()).toBeTruthy());

    return expect(alert.getText()).toEqual([
      "Alert",
      "Hello World!"
    ].join("\n"));
  });

  it("supports accepting alerts", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("confirm-alert-button")).tap();

    await device.waitFor(() => expect(alert.isVisible()).toBeTruthy());

    await alert.accept();

    return device.waitFor(() => {
      return expect(alert.getText()).toEqual([
        "Alert",
        "Accepted!"
      ].join("\n"));
    });
  });

  it("supports cancelling alerts", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("confirm-alert-button")).tap();

    await device.waitFor(() => expect(alert.isVisible()).toBeTruthy());

    await alert.dismiss();

    return device.waitFor(() => {
      return expect(alert.getText()).toEqual([
        "Alert",
        "Cancelled!"
      ].join("\n"));
    });
  });
});