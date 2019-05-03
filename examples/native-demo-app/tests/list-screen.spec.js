const { by, element, elements, commands } = require("../../../index");

describe("List Screen", () => {
  const screenTestId = "list-screen";

  it("works", async () => {
    console.log("[1] Waiting for screen to load...");
    await element(by.label(screenTestId)).waitToExist(by.label(screenTestId));

    const listItems = await elements(by.label("list-item-*"));
    console.log("Found elements", listItems.length);

    for (let i = 0; i < 10; i += 1) {
      const $listItem = listItems[i];

      await $listItem.tap();
      await element(by.label("OK"))
        .waitToBeVisible(by.label("OK"))
        .tap();

      console.log("item", i + 1);
    }
  });
});