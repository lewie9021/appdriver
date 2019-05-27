const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button")).waitFor(() => Promise.resolve());

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitFor(() => Promise.resolve());

  expect($newElement).not.toBe($element);
});

it("throws if element isn't found initially", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  const result = element(by.label("button"))
    .waitFor(() => Promise.resolve());

  await expect(result).rejects.toThrow(ElementNotFoundError);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  const result = element(by.label("button"))
    .tap()
    .waitFor(() => Promise.resolve());

  await expect(result).rejects.toThrow(ElementActionError);
});

it("polls until default maxDuration (5000ms) is exceeded", async () => {
  jest.setTimeout(6000);

  appiumServer.mockFindElement({elementId: "elementId"});
  const conditionFn = jest.fn(() => Promise.reject());

  await expect(element(by.label("button")).waitFor(conditionFn))
    .rejects.toThrow(new Error("wait condition exceeded 5000ms timeout (interval: 200ms)."));

  expect(conditionFn).toHaveBeenCalledTimes(5000 / 200);
});

describe("maxDuration parameter", () => {
  it("customises how long to poll before throwing", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const conditionFn = jest.fn(() => Promise.reject());
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitFor(conditionFn, {maxDuration}))
      .rejects.toThrow(new Error(`wait condition exceeded ${maxDuration}ms timeout (interval: 200ms).`));

    expect(conditionFn).toHaveBeenCalledTimes(maxDuration / 200);
  });
});

describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    jest.setTimeout(6000);

    appiumServer.mockFindElement({elementId: "elementId"});
    const conditionFn = jest.fn(() => Promise.reject());
    const interval = 1000;

    await expect(element(by.label("button")).waitFor(conditionFn, {interval}))
      .rejects.toThrow(new Error(`wait condition exceeded 5000ms timeout (interval: ${interval}ms).`));

    expect(conditionFn).toHaveBeenCalledTimes(5000 / interval);
  });
});