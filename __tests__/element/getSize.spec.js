jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementSizeFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns the element's width and height", async () => {
  const width = 200;
  const height = 150;
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.size, () => createElementSizeFixture({width, height}));

  const result = await element(by.label("box")).getSize();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.size).toHaveBeenCalledTimes(1);
  expect(result).toEqual({width, height});
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.attributes.size, () => createElementSizeFixture({width: 100, height: 32}));

  await expect(element(by.label("box")).getSize())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.size).not.toHaveBeenCalledTimes(1);
});

it("correctly handles size attribute request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.size, () => createElementSizeFixture({status: 3}));

  await expect(element(by.label("box")).getSize())
    .rejects.toThrow(new ElementActionError("Failed to get element size."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.size).toHaveBeenCalledTimes(1);
});