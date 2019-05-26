const appiumServer = require("../helpers/appiumServer");

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
  appiumServer.mockClickElement({elementId: "elementId"});

  const $element = await element(by.label("product-title")).tap();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const $element = await element(by.label("list-item"));
  const $newElement = await $element.tap();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7});
  appiumServer.mockClickElement({elementId: "elementId"});

  await expect(element(by.label("list-item")).tap())
    .rejects.toThrow(ElementNotFoundError);
});

it("correctly handles click action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  return expect(element(by.label("list-item")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));
});