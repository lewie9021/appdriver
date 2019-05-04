const commands = require("../src/commands");
const { by } = require("../src/matchers");
const { delay } = require("../src/utils");
const { element, Element } = require("../src/element.js");
const elementFixture = require("./fixtures/element.json");
const tapFixture = require("./fixtures/tap.json");

beforeEach(() => {
  jest.spyOn(commands.element, "findElement")
    .mockImplementation(() => {
      return delay(1000)
        .then(() => elementFixture);
    });

  jest.spyOn(commands.element.actions, "click")
    .mockImplementation(() => {
      return delay(1000)
        .then(() => tapFixture);
    });
});

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
    const selector = element(by.label("list-item"));

    expect(selector).toBeInstanceOf(Element);
    expect(typeof selector.then).toBe("function");
  });

  it("executes the matcher when awaited", async () => {
    const selector = element(by.label("list-item"));
    const $element = await selector;

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toBeCalledTimes(1);
  });

  it("allows chaining methods", async () => {
    const $element = await element(by.label("list-item")).tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });
});