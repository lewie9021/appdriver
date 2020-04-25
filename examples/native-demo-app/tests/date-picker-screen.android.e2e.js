const { by, element, device } = require("../../../main");


describe("Date Picker Screen", () => {
  before(async () => {
    await element(by.label("list-item-date-picker-screen")).tap();
  });

  it("works", async () => {
    const $screen = await element(by.label("date-picker-screen"));
    await $screen.findElement(by.label("select-date-button")).tap();

    await element(by.id("android:id/datePicker")).waitToBeVisible();

    const $date = await element(by.id("android:id/date_picker_header_date"));
    const $year = await element(by.id("android:id/date_picker_header_year"));

    const day = "28";
    const month = "August";
    const year = "2500";

    console.log("date:", await $date.getText());
    console.log("year:", await $year.getText());

    await device.wait(2000);
  });
});