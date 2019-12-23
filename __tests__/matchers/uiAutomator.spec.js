jest.mock("../../src/worker/stores/sessionStore");
jest.mock("../../src/worker/services/appiumService");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { NotImplementedError } = require("../../src/worker/errors");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android"));

  it("supports simple queries", () => {
    const selector = `new UiSelector().className("android.widget.EditText")`;

    expect(by.uiAutomator(selector)).toEqual({
      using: "-android uiautomator",
      value: selector
    });
  });
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

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