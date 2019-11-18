const { by, element } = require("../../../index");

describe("Swipeable Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-swipeable-screen")).tap();
    await element(by.label("swipeable-screen")).waitToBeVisible();
  });

  it("removes the item", async () => {
    await element(by.label("list-item"))
      .swipe({ distance: 200, direction: 270 });

    await element(by.label("remove-button")).tap();
  });
});