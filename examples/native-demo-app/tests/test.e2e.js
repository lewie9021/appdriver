const { by, alert, device, element, expect } = require("../../../main");

describe("Test", () => {
  xit("works", async () => {
    // await element(by.label("menu-screen")).waitToBeVisible();

    await device.wait(5000);

    console.log("Visible:", await alert.isVisible());
    await expect(alert.getText()).toEqual("Title 2\nMessage 2");
    await alert.accept();

    console.log("Visible:", await alert.isVisible());
    await expect(alert.getText()).toEqual("Title 1\nMessage 1");
    await alert.accept();

    console.log("Visible:", await alert.isVisible());
  });

  it("works2", async () => {
    await device.wait(5000);

    let text = await alert.getText();
    console.log("[1] Alert present:", text.split("\n"));
    await alert.dismiss();
    console.log("[1] Dismissed");

    // await device.waitFor(() => expect(alert.isVisible()).toEqual(true));
    // text = await alert.getText();
    // console.log("[2] Alert present:", text.split("\n"));
    // await alert.accept();
    // console.log("[2] Accepted");
    //
    // await device.waitFor(() => expect(alert.isVisible()).toEqual(true));
    // text = await alert.getText();
    // console.log("[3] Alert present:", text.split("\n"));
    // await alert.accept();
    // console.log("[3] Accepted");

    console.log("Done!");
    await device.wait(5000);
  });
});