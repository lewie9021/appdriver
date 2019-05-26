const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const $element = await element(by.label("button")).waitToBeVisible();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToBeVisible();

  expect($newElement).not.toBe($element);
});

it("polls for visibility up to 5 times before throwing", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  await expect(element(by.label("button")).waitToBeVisible())
    .rejects.toThrow(new Error("Element not visible after 5 attempts (interval: 200ms)."));

  expect(fetch).toHaveBeenCalledTimes(6);
});

it("attempts to find the element before checking visibility if receives an ElementNotFound error", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  await expect(element(by.label("button")).waitToBeVisible())
    .rejects.toThrow(new Error("Element not visible after 5 attempts (interval: 200ms)."));

  expect(fetch).toHaveBeenCalledTimes(6);
});

it("forwards new element.value if findElement request is required to check visibility", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const $element = await element(by.label("button")).waitToBeVisible();

  await expect($element.value).resolves.toEqual(elementFixture);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  await expect(element(by.label("button")).tap().waitToBeVisible())
    .rejects.toThrow(ElementActionError);
});

it("correctly handles displayed attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  await expect(element(by.label("button")).waitToBeVisible())
    .rejects.toThrow(new ElementActionError("Element not visible after 5 attempts (interval: 200ms)."));

  expect(fetch).toHaveBeenCalledTimes(6);
});

describe("maxRetries parameter", () => {
  it("customises the number of retries to make before throwing", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

    const maxRetries = 10;

    await expect(element(by.label("button")).waitToBeVisible({maxRetries}))
      .rejects.toThrow(new ElementActionError(`Element not visible after ${maxRetries} attempts (interval: 200ms).`));

    expect(fetch).toHaveBeenCalledTimes(maxRetries + 1);
  });

  it("is factored into the number of retries made if the element doesn't exist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});
    const maxRetries = 8;

    await expect(element(by.label("button")).waitToBeVisible({maxRetries}))
      .rejects.toThrow(new ElementActionError(`Element not visible after ${maxRetries} attempts (interval: 200ms).`));

    // find element 3 times, element displayed 6.
    expect(fetch).toHaveBeenCalledTimes(9);
  }, 10000);
});

// TODO: Needs better coverage that just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});
    const interval = 50;

    await expect(element(by.label("button")).waitToBeVisible({interval}))
      .rejects.toThrow(new ElementActionError(`Element not visible after 5 attempts (interval: ${interval}ms).`));

    expect(fetch).toHaveBeenCalledTimes(6);
  });

  it("is factored into the request polling if the element doesn't exist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});
    const interval = 50;

    await expect(element(by.label("button")).waitToBeVisible({interval}))
      .rejects.toThrow(new ElementActionError(`Element not visible after 5 attempts (interval: ${interval}ms).`));

    expect(fetch).toHaveBeenCalledTimes(6);
  }, 10000);
});