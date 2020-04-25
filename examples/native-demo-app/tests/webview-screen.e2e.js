const { by, element, device, expect } = require("../../../main");

describe("WebView Screen", () => {
  before(async () => {
    await element(by.label("list-item-webview-screen")).tap();
  });

  it("works", async () => {
    await element(by.label("webview-screen")).waitToBeVisible();

    await device.waitFor(() => expect(device.getContexts()).toHaveLength(2));
    await device.switchToWebContext();

    await element(by.css(`input[name="q"]`)).setValue("Hello World");

    await device.wait(2000);
  });
});