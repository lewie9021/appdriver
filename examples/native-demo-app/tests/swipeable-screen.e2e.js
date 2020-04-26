const { by, element, device, alert, expect } = require("../../../main");

describe("Swipeable Screen", () => {
  before(async () => {
    await element(by.label("list-item-swipeable-screen")).tap();
  });

  it("removes the item", async () => {
    const $screen = await element(by.label("swipeable-screen"));
    const $listItem = await $screen.findElement(by.label("list-item"));

    await $listItem.swipeLeft({ percentage: 0.75 });

    await $listItem.findElement(by.label("remove-button")).tap();

    await alert.waitToBeVisible();
    await alert.accept();
  });
});