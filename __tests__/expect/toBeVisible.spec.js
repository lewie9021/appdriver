jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by, element, expect: assert } = require("../../index");
const { ElementActionError } = require("../../src/errors");
const mockCommand = require("../helpers/mockCommand");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementDisplayedFixture } = require("../fixtures/fixtures");

it("doesn't throw if expectation is met", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({displayed: true}));

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({displayed: false}));

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .rejects.toThrow(new Error("Expected element to be visible but instead got 'false'."));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.displayed, () => createElementDisplayedFixture({status: 3}));

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .rejects.toThrow(new ElementActionError("Failed to get visibility status of element."));
});