const { by, element, device } = require("../../../index");

describe("WebView Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-webview-screen")).tap();
    await element(by.label("webview-screen")).waitToBeVisible();
  });

  it("works", async () => {
    console.log("Context:", await device.getContext());
    console.log("Available Contexts:", await device.getContexts());

    await device.switchToWebContext();

    console.log("New Context:", await device.getContext());

    await element(by.css(`input[name="q"]`))
      .waitToBeVisible()
      .typeText("Hello World");

    await device.wait(2000);
  });
});