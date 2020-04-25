const { by, element, device, expect } = require("../../../main");

describe("Date Picker Screen", () => {
  before(async () => {
    await element(by.label("list-item-date-picker-screen")).tap();
  });

  it("works", async () => {
    const $screen = await element(by.label("date-picker-screen"));

    const [ $month, $day, $year ] = await $screen.findElement(by.label("date-picker"))
      .findElements(by.type("XCUIElementTypePickerWheel"));

    const day = "1";
    const month = "September";
    const year = "2050";

    await device.while(
      () => expect($month).not.toHaveValue(month),
      () => $month.setValue(month)
    );

    await device.while(
      () => expect($day).not.toHaveValue(day),
      () => $day.setValue(day)
    );

    await device.while(
      () => expect($year).not.toHaveValue(year),
      () => $year.setValue(year)
    );

    await expect($month).toHaveValue(month);
    await expect($day).toHaveValue(day);
    await expect($year).toHaveValue(year);
  });
});