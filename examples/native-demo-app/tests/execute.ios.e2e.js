const { by, element, device, alert } = require("../../../main");

describe("Execute (iOS)", () => {
  it("works", async () => {
    await element(by.label("list-item-swipeable-screen")).tap();
    const $listItem = await element(by.label("list-item"));
    const ref = await $listItem.getRef();

    await device.execute("mobile:swipe", { direction: "left", element: ref });

    await $listItem.findElement(by.label("remove-button")).tap();

    await alert.waitToBeVisible();
    await alert.accept();
  });
});