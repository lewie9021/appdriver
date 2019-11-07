const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/Element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement({elementId: "elementId"});

  const $element = await element(by.label("text-input")).clearText();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual("elementId");
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement({elementId: "elementId"});

  const $element = await element(by.label("text-input"));
  const $newElement = await $element.clearText();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions({ status: 3 });
  appiumServer.mockClearElement({elementId: "elementId"});

  const result = element(by.label("text-input"))
    .tap()
    .clearText();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("throws action error if element doesn't exist", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockClearElement({elementId: "elementId"});

  const result = element(by.label("text-input"))
    .clearText();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("correctly handles clear action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClearElement({status: 3, elementId: "elementId"});

  await expect(element(by.label("text-input")).clearText())
    .rejects.toThrow(new ElementActionError("Failed to clear text."));

  expect(fetch).toHaveBeenCalledTimes(2);
});

