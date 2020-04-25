const { by, element, expect } = require("../../../main");

describe("Carousel Screen", () => {
  before(async () => {
    await element(by.label("list-item-carousel-screen")).tap();
  });

  it("works", async () => {
    const $screen = await element(by.label("carousel-screen"));

    const $pageOne = await $screen.findElement(by.label("page-one"));
    await expect($pageOne).toBeVisible();

    await $pageOne.swipeLeft({ y: 300, percentage: 0.75 });
    await $pageOne.waitToBeInvisible();

    const $pageTwo = await $screen.findElement(by.label("page-two"));
    await expect($pageTwo).toBeVisible();

    await $pageTwo.swipeLeft({ y: 300, percentage: 0.75 });
    await $pageTwo.waitToBeInvisible();

    const $pageThree = await $screen.findElement(by.label("page-three"));
    await expect($pageThree).toBeVisible();
  });
});