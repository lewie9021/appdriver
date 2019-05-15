jest.mock("../../src/commands");
jest.mock("../../src/session");
const commands = require("../../src/commands");
const session = require("../../src/session");

const { by, element, expect: assert } = require("../../index");
const { ElementActionError } = require("../../src/errors");
const mockCommand = require("../helpers/mockCommand");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementValueFixture } = require("../fixtures/fixtures");

beforeAll(() => {
  session.getSession.mockReturnValue({
    platformName: "iOS"
  });
});

it("doesn't throw if expectation is met", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.type, () => "XCUIElementTypeStaticText");
  mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "Hello World!"}));

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue("Hello World!"))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  const actualValue = "Hello!";
  const expectedValue = "Hello World!";
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.type, () => "XCUIElementTypeStaticText");
  mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: actualValue}));

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue(expectedValue))
    .rejects.toThrow(new Error(`Expected element to have value '${expectedValue}' but instead got '${actualValue}'.`));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.type, () => "XCUIElementTypeStaticText");
  mockCommand(commands.element.attributes.value, () => createElementValueFixture({status: 3}));

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue("My Product"))
    .rejects.toThrow(new ElementActionError("Failed to get value for element."));
});