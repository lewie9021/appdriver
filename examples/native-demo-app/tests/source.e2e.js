const { by, element, device, expect } = require("../../../main");

describe("Page Source", () => {
  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
  });

  it("works", async () => {
    const source = await device.getSource();

    await expect(source.length).toBeMoreThan(0)
  });
});