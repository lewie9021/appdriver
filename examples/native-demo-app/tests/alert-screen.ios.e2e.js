const { by, alert, device, element } = require("../../../main");

describe("Alert Screen (iOS)", () => {
  let $screen;

  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-alert-screen")).tap();
    await element(by.label("menu-screen")).waitToBeInvisible();
    $screen = await element(by.label("alert-screen")).waitToBeVisible();
  });

  it("supports iOS prompts", async () => {
    await $screen.findElement(by.label("prompt-button")).tap();

    await alert.setValue("Hello World!");
    await alert.setValue("Testing!");

    await device.wait(2000);
  });
});