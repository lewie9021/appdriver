jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, () => elementFixture);
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  const $element = await element(by.label("button")).longPress();

  expect($element).toBeInstanceOf(Element);
  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("executes a long press gesture", async () => {
  const elementId = "elementId";
  mockCommand(commands.element.findElement, () => createElementFixture({elementId}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  await element(by.label("button")).longPress();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toBeCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y: 0},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 750},
      {type: "pointerUp", button: 0}
    ]
  }])
});

it("accepts an x parameter to offset from the left of the element", async () => {
  const elementId = "elementId";
  const x = 100;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  await element(by.label("button")).longPress({x});

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toBeCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: {element: elementId}, x, y: 0},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 750},
      {type: "pointerUp", button: 0}
    ]
  }])
});

it("accepts an y parameter to offset from the top of the element", async () => {
  const elementId = "elementId";
  const y = 32;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  await element(by.label("button")).longPress({y});

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toBeCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 750},
      {type: "pointerUp", button: 0}
    ]
  }])
});

it("accepts a duration parameter to redefine how long to perform the press action", async () => {
  const elementId = "elementId";
  const duration = 1000;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  await element(by.label("button")).longPress({duration});

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toBeCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y: 0},
      {type: "pointerDown", button: 0},
      {type: "pause", duration},
      {type: "pointerUp", button: 0}
    ]
  }])
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  const $element = await element(by.label("button"));
  const $newElement = await $element.longPress();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.interactions.actions, () => createFixture({value: {}}));

  await expect(element(by.label("button")).longPress())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).not.toHaveBeenCalledTimes(1);
});

it("correctly handles W3C action request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.interactions.actions, () => createFixture({status: 3}));

  return expect(element(by.label("button")).longPress())
    .rejects.toThrow(new ElementActionError("Failed to long press element."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
});