const { by, element, device } = require("../../../index");

describe("Carousel Screen", () => {
  const screenTestId = "carousel-screen";

  it("works", async () => {
    console.log("[1] Waiting for screen to load...");
    await element(by.label(screenTestId)).waitToBeVisible();

    console.log("[3] Swiping to next page...");
    await device.swipeLeft({y: 300, percentage: 0.75});

    console.log("[4] Swiping to next page...");
    await device.swipeLeft({y: 300, percentage: 0.75});
  });
});