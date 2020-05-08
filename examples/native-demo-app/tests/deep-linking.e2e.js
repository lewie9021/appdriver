const { by, element, device } = require("../../../main");

describe("Deep Linking", () => {
  it("works", async () => {
    await element(by.label("menu-screen")).waitToBeVisible();

    await device.navigate("com.nativedemoapp://testing?hello=world");
    await device.wait(5000);
  });
});