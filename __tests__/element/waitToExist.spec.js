const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");

/*
afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button")).waitToExist();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToExist();

  expect($newElement).not.toBe($element);
});

it("polls for existence up to 5 times before throwing", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  await expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new Error("Element not found after 5 attempts (interval: 200ms)."));

  expect(fetch).toHaveBeenCalledTimes(6);
});

it("forwards new element.value if element isn't found initially", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button")).waitToExist();

  await expect($element.value).resolves.toEqual(elementFixture);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  await expect(element(by.label("button")).tap().waitToExist())
    .rejects.toThrow(ElementActionError);
});

it("correctly handles exists attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  await expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new ElementActionError("Element not found after 5 attempts (interval: 200ms)."));

  expect(fetch).toHaveBeenCalledTimes(6);
});

describe("maxRetries parameter", () => {
  it("customises the number of retries to make before throwing", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const maxRetries = 10;

    await expect(element(by.label("button")).waitToExist({maxRetries}))
      .rejects.toThrow(new ElementActionError(`Element not found after ${maxRetries} attempts (interval: 200ms).`));

    expect(fetch).toHaveBeenCalledTimes(maxRetries + 1);
  });
});

// TODO: Needs better coverage that just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const interval = 50;

    await expect(element(by.label("button")).waitToExist({interval}))
      .rejects.toThrow(new ElementActionError(`Element not found after 5 attempts (interval: ${interval}ms).`));
  });
});
 */