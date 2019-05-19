const appiumServer = require("../helpers/appiumServer");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementClick();

  const $element = await element(by.label("product-title")).tap();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementClick();

  const $element = await element(by.label("list-item"));
  const $newElement = await $element.tap();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7});
  appiumServer.mockElementClick();

  await expect(element(by.label("list-item")).tap())
    .rejects.toThrow(ElementNotFoundError);
});

it("correctly handles click action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementClick({status: 3});

  return expect(element(by.label("list-item")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));
});