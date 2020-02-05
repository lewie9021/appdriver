const { by, element, device, expect } = require("../../../index");

describe("WebView Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-webview-screen")).tap();
    await element(by.label("webview-screen")).waitToBeVisible();
  });

  it("works", async () => {
    console.log("Context:", await device.getContext());
    console.log("Available Contexts (Before):", await device.getContexts());

    await device.waitFor(async () => {
      const contexts = await device.getContexts();
      const google = contexts.find((x) => x.url === "https://www.google.com/");

      return expect(google).toBeTruthy();
    });

    console.log("Available Contexts (After):", await device.getContexts());

    await device.switchToWebContext();

    console.log("New Context:", await device.getContext());

    await element(by.css(`input[name="q"]`))
      .waitToBeVisible()
      .typeText("Hello World");

    await device.wait(2000);
  });
});