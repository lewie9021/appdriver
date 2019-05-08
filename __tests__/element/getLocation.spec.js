jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementLocationFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns the element's x and y coordinates", async () => {
  const x = 150;
  const y = 400;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.location, () => createElementLocationFixture({x, y}));

  const result = await element(by.label("box")).getLocation();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.location).toHaveBeenCalledTimes(1);
  expect(result).toEqual({x, y});
});

it("accepts a 'relative' parameter to return the element's x and y coordinates relative to the viewport", async () => {
  const x = 150;
  const y = 100;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.locationInView, () => createElementLocationFixture({x, y}));

  const result = await element(by.label("box")).getLocation({relative: true});

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.locationInView).toHaveBeenCalledTimes(1);
  expect(result).toEqual({x, y});
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.attributes.location, () => createElementLocationFixture({x: 150, height: 100}));

  await expect(element(by.label("box")).getLocation())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.location).not.toHaveBeenCalledTimes(1);
});

it("correctly handles location attribute request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.location, () => createElementLocationFixture({status: 3}));

  await expect(element(by.label("box")).getLocation())
    .rejects.toThrow(new ElementActionError("Failed to get element location."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.location).toHaveBeenCalledTimes(1);
});

it("correctly handles relative location attribute request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.locationInView, () => createElementLocationFixture({status: 3}));

  await expect(element(by.label("box")).getLocation({relative: true}))
    .rejects.toThrow(new ElementActionError("Failed to get element relative location."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.locationInView).toHaveBeenCalledTimes(1);
});