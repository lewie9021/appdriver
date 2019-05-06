jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementValueFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

beforeAll(() => {
  global.session = {
    platformName: "iOS"
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, () => elementFixture);
  mockCommand(commands.element.actions.sendKeys, () => createElementValueFixture());

  const $element = await element(by.label("text-input")).typeText("Hello World!");

  expect($element).toBeInstanceOf(Element);
  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.sendKeys).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("throws if no text isn't a string", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));

  await expect(element(by.label("text-input")).typeText())
    .rejects.toThrow(new Error("Failed to type text. 'text' must be a string, instead got undefined."));

  await expect(element(by.label("text-input")).typeText(1000))
    .rejects.toThrow(new Error("Failed to type text. 'text' must be a string, instead got number."));
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.sendKeys, () => createElementValueFixture());

  const $element = await element(by.label("text-input"));
  const $newElement = await $element.typeText("Hello World!");

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.actions.sendKeys, () => createElementValueFixture());

  await expect(element(by.label("text-input")).typeText("Hello World!"))
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.sendKeys).not.toHaveBeenCalledTimes(1);
});

it("correctly handles send key request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.sendKeys, () => createElementValueFixture({status: 3}));

  return expect(element(by.label("text-input")).typeText("Hello World!"))
    .rejects.toThrow(new ElementActionError("Failed to type text."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
});

it("correctly handles case when hardware keyboard is attached on iOS simulator", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.actions.sendKeys, () => createElementValueFixture({status: 13}));

  return expect(element(by.label("text-input")).typeText("Hello World!"))
    .rejects.toThrow(new ElementActionError("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
});