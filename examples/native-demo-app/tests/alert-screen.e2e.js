const { by, alert, device, element, expect } = require("../../../main");

describe("Alert Screen", () => {
  let $screen;

  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-alert-screen")).tap();
    await element(by.label("menu-screen")).waitToBeInvisible();
    $screen = await element(by.label("alert-screen")).waitToBeVisible();
  });

  afterEach(() => alert.dismiss());

  it("supports retrieving alert text", async () => {
    await $screen.findElement(by.label("alert-button")).tap();

    await expect(alert.getText()).toEqual([
      "Alert",
      "Hello World!"
    ].join("\n"));
  });

  it("supports accepting alerts", async () => {
    await $screen.findElement(by.label("confirm-alert-button")).tap();
    await alert.accept();

    await device.waitFor(() => {
      return expect(alert.getText()).toEqual([
        "Alert",
        "Accepted!"
      ].join("\n"));
    });
  });

  it("supports cancelling alerts", async () => {
    await $screen.findElement(by.label("confirm-alert-button")).tap();
    await alert.dismiss();

    await device.waitFor(() => {
      return expect(alert.getText()).toEqual([
        "Alert",
        "Cancelled!"
      ].join("\n"));
    });
  });
});