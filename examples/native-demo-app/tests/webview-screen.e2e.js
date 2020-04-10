const { by, element, device, expect } = require("../../../main");

describe("WebView Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-webview-screen")).tap();
    await element(by.label("webview-screen")).waitToBeVisible();
  });

  it("works", async () => {
    await device.switchToWebContext();

    await element(by.css(`input[name="q"]`))
      .waitToBeVisible()
      .typeText("Hello World");

    await device.wait(2000);
  });
});