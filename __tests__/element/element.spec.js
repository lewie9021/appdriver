const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementNotFoundError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns a selector", () => {
  const selector = element(by.label("list-item"));

  expect(selector).toBeInstanceOf(Element);
  expect(fetch).not.toHaveBeenCalled();
});

it("returns an 'Element' that is 'thenable'", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const selector = element(by.label("list-item"));

  expect(selector).toBeInstanceOf(Element);
  expect(typeof selector.then).toBe("function");
});

it("executes the matcher when awaited", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const selector = element(by.label("list-item"));
  const $element = await selector;

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("allows chaining methods", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const $element = await element(by.label("list-item")).tap();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("throws ElementNotFoundError if request fails", async () => {
  appiumServer.mockFindElement({status: 3, elementId: "elementId"});

  await expect(element(by.label("list-item")))
    .rejects.toThrow(ElementNotFoundError);

  expect(fetch).toHaveBeenCalledTimes(1);
});