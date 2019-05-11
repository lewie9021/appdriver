const { by, element, device } = require("../../../index");

describe("Carousel Screen", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-carousel-screen")).tap();
    await element(by.label("carousel-screen")).waitToBeVisible();
  });

  it("works", async () => {
    await device.swipeLeft({y: 300, percentage: 0.75});
    await device.swipeLeft({y: 300, percentage: 0.75});
  });
});