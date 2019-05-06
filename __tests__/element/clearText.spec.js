jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementClearFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, () => elementFixture);
  mockCommand(commands.element.actions.clear, () => createElementClearFixture());

  const $element = await element(by.label("text-input")).clearText();

  expect($element).toBeInstanceOf(Element);
  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.clear).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.clear, () => createElementClearFixture());

  const $element = await element(by.label("text-input"));
  const $newElement = await $element.clearText();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.actions.clear, () => createElementClearFixture());

  await expect(element(by.label("text-input")).clearText())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.clear).not.toHaveBeenCalledTimes(1);
});

it("correctly handles clear action request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.clear, () => createElementClearFixture({status: 3}));

  return expect(element(by.label("text-input")).clearText())
    .rejects.toThrow(new ElementActionError("Failed to clear text."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.clear).toHaveBeenCalledTimes(1);
});