const { by, element, expect, device } = require("../../../index");


describe("Date Picker Screen", () => {
  let $screen;

  before(async () => {
    await element(by.label("menu-screen")).waitToBeVisible();
    await element(by.label("list-item-date-picker-screen")).tap();
    await element(by.label("menu-screen")).waitToBeInvisible();
    $screen = await element(by.label("date-picker-screen")).waitToBeVisible();
  });

  it("works", async () => {
    await element(by.label("select-date-button")).tap();
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