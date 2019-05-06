jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementClickFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, () => elementFixture);
  mockCommand(commands.element.actions.click, () => createElementClickFixture());

  const $element = await element(by.label("product-title")).tap();

  expect($element).toBeInstanceOf(Element);
  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.click, () => createElementClickFixture());

  const $element = await element(by.label("list-item"));
  const $newElement = await $element.tap();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.actions.click, () => createElementClickFixture());

  await expect(element(by.label("list-item")).tap())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.click).not.toHaveBeenCalledTimes(1);
});

it("correctly handles click action request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.click, () => createElementClickFixture({status: 3}));

  return expect(element(by.label("list-item")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
});