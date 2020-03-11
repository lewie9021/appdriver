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
    const [ $month, $day, $year ] = await element(by.label("date-picker"))
      .findElements(by.type("XCUIElementTypePickerWheel"));

    const day = "28";
    const month = "August";
    const year = "2500";

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
      () => $year.setValue(year),
      { maxDuration: 3000 }
    );

    // waitFor(condition: ($e: Element) => Promise, options?: object) => Promise.
    // await $day.waitFor(($e) => expect($e).toHaveValue("25"));

    // while(condition: ($e: Element) => Promise, action: ($e: Element) => Promise, options?: object) => Promise.
    // await $day.while(
    //   ($e) => expect($e).not.toHaveValue("25"),
    //   ($e) => $e.setValue("25")
    // );

    // while(condition: ($e: Element) => Promise, action: ($e: Element) => Promise, options?: object) => Promise.
    // await element(by.label("button")).while(
    //   ($e) => expect($e).not.toBeVisible(), // First calls would return false because it may not exist.
    //   () => element(by.label("scroll-view")).swipeUp({ distance: 100 })
    // );

    await expect($month).toHaveValue(month);
    await expect($day).toHaveValue(day);
    await expect($year).toHaveValue(year);
  });
});