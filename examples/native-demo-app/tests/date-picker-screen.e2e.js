const { by, element, expect } = require("../../../index");

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

    const day = "25";
    const month = "May";
    const year = "2023";

    await $month.while(
      ($e) => expect($e).not.toHaveValue(month),
      ($e) => $e.setValue(month)
    );

    await $day.while(
      ($e) => expect($e).not.toHaveValue(day),
      ($e) => $e.setValue(day)
    );

    await $year.while(
      ($e) => expect($e).not.toHaveValue(year),
      ($e) => $e.setValue(year)
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

    await expect($month).toHaveValue("May");
    await expect($day).toHaveValue("25");
    await expect($year).toHaveValue("2023");
  });
});