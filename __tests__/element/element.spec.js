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

it("allows chaining methods", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const $element = await element(by.label("list-item")).tap();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
});