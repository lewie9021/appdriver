const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const $element = await element(by.label("product-title")).tap();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual("elementId");
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
  appiumServer.mockClearElement({status: 3, elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const result = element(by.label("list-item"))
    .clearText()
    .tap();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("throws action error if element doesn't exist", async () => {
  appiumServer.mockFindElement({status: 7});
  appiumServer.mockClickElement({elementId: "elementId"});

  const result = element(by.label("list-item"))
    .tap();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("correctly handles click action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  return expect(element(by.label("list-item")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));
});