jest.mock("../../src/commands");
jest.mock("../../src/session");
const commands = require("../../src/commands");
const session = require("../../src/session");

const { by, element, expect: assert } = require("../../index");
const { ElementActionError } = require("../../src/errors");
const mockCommand = require("../helpers/mockCommand");
const { createElementFixture } = require("../fixtures/fixtures");

beforeAll(() => {
  session.getSession.mockReturnValue({
    platformName: "iOS"
  });
});

it("doesn't throw if expectation is met", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => "My Product");

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText("My Product"))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  const actualText = "My Other Product";
  const expectedText = "My Product";
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => actualText);

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText(expectedText))
    .rejects.toThrow(new Error(`Expected element to have text '${expectedText}' but instead got '${actualText}'.`));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.text, () => Promise.reject(new Error("Error!")));

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText("My Product"))
    .rejects.toThrow(new ElementActionError("Failed to get text for element."));
});