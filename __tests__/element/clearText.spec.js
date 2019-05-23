const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement();

  const $element = await element(by.label("text-input")).clearText();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement();

  const $element = await element(by.label("text-input"));
  const $newElement = await $element.clearText();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockClearElement();

  await expect(element(by.label("text-input")).clearText())
    .rejects.toThrow(ElementNotFoundError);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("/session/sessionId/element"),
    expect.anything()
  );
});

it("correctly handles clear action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement({status: 3});

  await expect(element(by.label("text-input")).clearText())
    .rejects.toThrow(new ElementActionError("Failed to clear text."));

  expect(fetch).toHaveBeenCalledTimes(2);
});