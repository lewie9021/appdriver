jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementTextFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns the element's text value", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => createElementTextFixture({text: "Title Text"}));

  const result = await element(by.label("product-title")).getText();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
  expect(result).toEqual("Title Text");
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => createElementTextFixture({text: "Title Text"}));

  await expect(element(by.label("product-title")).getText())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.text).not.toHaveBeenCalledTimes(1);
});

it("correctly handles text attribute request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => createElementTextFixture({status: 3, text: null}));

  await expect(element(by.label("product-title")).getText())
    .rejects.toThrow(new ElementActionError("Failed to get text for element."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
});