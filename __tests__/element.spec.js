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

  jest.spyOn(commands.element.actions, "tap")
    .mockImplementation(() => {
      return delay(1000)
        .then(() => tapFixture);
    });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Find Element", () => {
  it("returns an 'Element' that is 'thenable'", async () => {
    const sessionId = "sessionId";
    const testId = "testId";

    const $element = await element(by.id(sessionId, testId));

    expect($element).toBeInstanceOf(Element);
  });

  it("allows chaining methods", async () => {
    const sessionId = "sessionId";
    const testId = "testId";

    const $element = await element(by.id(sessionId, testId))
      .tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.tap).toHaveBeenCalledTimes(1);
  });
});