jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementClickFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

describe("Find Element", () => {
  it("returns a selector", () => {
    const selector = element(by.label("list-item"));

    expect(selector).toBeInstanceOf(Element);
    expect(commands.element.findElement).not.toBeCalled();
  });

  it("returns an 'Element' that is 'thenable'", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));

    const selector = element(by.label("list-item"));

    expect(selector).toBeInstanceOf(Element);
    expect(typeof selector.then).toBe("function");
  });

  it("executes the matcher when awaited", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));

    const selector = element(by.label("list-item"));
    const $element = await selector;

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toBeCalledTimes(1);
  });

  it("allows chaining methods", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.actions.click, () => createElementClickFixture());

    const $element = await element(by.label("list-item")).tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });

  it("throws ElementNotFoundError if request fails", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({status: 3, elementId: "elementId"}));

    await expect(element(by.label("list-item")))
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  });
});