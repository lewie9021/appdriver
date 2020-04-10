const { by, element, elements } = require("../../../main");

describe("List Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-list-screen")).tap();
    await element(by.label("list-screen")).waitToBeVisible();
  });

  it("works", async () => {
    const listItems = await elements(by.label("item-*"));
    console.log("Found elements", listItems.length);

    for (let i = 0; i < 10; i += 1) {
      const $listItem = listItems[i];

      await $listItem.tap();
      await element(by.label("OK"))
        .waitToBeVisible()
        .tap();

      console.log("item", i + 1);
    }
  });
});