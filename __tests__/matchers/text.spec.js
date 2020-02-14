jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { NotImplementedError } = require("../../src/worker/errors");
const Matcher = require("../../src/worker/Matcher");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a Matcher instance", () => {
  const text = "Hello World!";
  const matcher = by.text(text);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("text");
  expect(matcher.value).toEqual(text);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const text = "hello";

    expect(by.text(text).resolve()).toEqual({
      using: `-android uiautomator`,
      value: `new UiSelector().text("${text}")`
    });
  });

  it("supports regex queries", () => {
    expect(by.text(/hello*/).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textMatches("hello*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.text(/HELLO*/i).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textMatches("(?i)HELLO*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const text = "Hello World!";

    expect(by.text(text).resolve()).toEqual({
      using: "-ios predicate string",
      value: `label = '${text}'`
    });
  });

  it("supports regex queries", () => {
    expect(by.text(/hello*/).resolve()).toEqual({
      using: "-ios predicate string",
      value: `label MATCHES 'hello*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.text(/HELLO*/i).resolve()).toEqual({
      using: "-ios predicate string",
      value: `label MATCHES[c] 'HELLO*'`
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.text("Hello World!").resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});