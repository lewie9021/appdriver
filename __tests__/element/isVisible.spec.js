jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementDisplayedFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns the element's displayed value", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({displayed: true}));

  const result = await element(by.label("button")).isVisible();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(1);
  expect(result).toEqual(true);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({displayed: true}));

  await expect(element(by.label("button")).isVisible())
    .rejects.toThrow(ElementNotFoundError);

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.displayed).not.toHaveBeenCalledTimes(1);
});

it("correctly handles displayed attribute request errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({status: 3}));

  await expect(element(by.label("product-title")).isVisible())
    .rejects.toThrow(new ElementActionError("Failed to get visibility status of element."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(1);
});