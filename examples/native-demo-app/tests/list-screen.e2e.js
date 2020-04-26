const { by, element, device, alert, expect } = require("../../../main");

describe("List Screen", () => {
  before(async () => {
    await element(by.label("list-item-list-screen")).tap();
  });

  it("works", async () => {
    const $screen = await element(by.label("list-screen"));
    const listItems = await $screen.findElements(by.label(/^list-item-\d+$/));

    console.log("Found elements", listItems.length);

    for (let i = 0; i < 5; i += 1) {
      const $listItem = listItems[i];

      await $listItem.tap();
      await alert.waitToBeVisible();
      await alert.accept();

      console.log("item", i + 1);
    }
  });
});