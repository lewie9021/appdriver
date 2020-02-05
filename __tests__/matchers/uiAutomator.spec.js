jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { NotImplementedError } = require("../../src/worker/errors");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const selector = `new UiSelector().className("android.widget.EditText")`;

    expect(by.uiAutomator(selector)).toEqual({
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
      by.uiAutomator(`new UiSelector().className("XCUIElementTypeTextField")`);
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.uiAutomator(`new UiSelector().className("input")`);
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});