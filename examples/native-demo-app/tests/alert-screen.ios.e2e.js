const { by, alert, device, element } = require("../../../main");

describe("Alert Screen (iOS)", () => {

  before(async () => {
    await element(by.label("list-item-alert-screen")).tap();
  });

  it("supports iOS prompts", async () => {
    const $screen = await element(by.label("alert-screen"));
    await $screen.findElement(by.label("prompt-button")).tap();

    await alert.setValue("Hello World!");

    await device.wait(2000);
  });
});