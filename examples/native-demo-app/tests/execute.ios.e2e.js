const { by, element, device } = require("../../../main");

describe("Execute (iOS)", () => {
  it("works", async () => {
    await element(by.label("list-item-swipeable-screen")).tap();
    const ref = await element(by.label("list-screen")).getRef();

    await device.execute("mobile:swipe", { direction: "left", element: ref.ELEMENT });
    await device.wait(5000);
  });
});