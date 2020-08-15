const { by, element, device, expect } = require("../../../main");

describe("WebView Screen", () => {
  before(async () => {
    await element(by.label("list-item-webview-screen")).tap();
  });

  it("works", async () => {
    await element(by.label("webview-screen")).waitToBeVisible();

    await device.waitFor(() => expect(device.getContexts()).toHaveLength(2));
    await device.switchToWebContext();

    const $input = await element(by.css(`input[name="q"]`));

    await $input.setValue("Hello World");
    await expect($input).toBeFocused();

    const value = await device.execute("arguments[0].value", await $input.getRef());
    await expect(value).toEqual("Hello World");

    await element(by.css(`button[aria-label="Google Search"]`)).tap();

    await device.wait(2000);
    await device.scroll({ direction: 180, distance: 500 });
    await device.wait(5000);
  });
});