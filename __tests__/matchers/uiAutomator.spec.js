jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { NotSupportedError } = require("../../src/worker/errors");
const Matcher = require("../../src/worker/Matcher");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a Matcher instance", () => {
  const selector = "new UiSelector().className(\"android.widget.EditText\")";
  const matcher = by.uiAutomator(selector);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("ui automator");
  expect(matcher.value).toEqual(selector);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const selector = `new UiSelector().className("android.widget.EditText")`;

    expect(by.uiAutomator(selector).resolve()).toEqual({
      using: "-android uiautomator",
      value: selector
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.uiAutomator(`new UiSelector().className("XCUIElementTypeTextField")`).resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.uiAutomator(`new UiSelector().className("input")`).resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }
  });
});