jest.mock("../../src/worker/stores/sessionStore");
jest.mock("../../src/worker/services/appiumService");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android"));

  it("supports simple queries", () => {
    const type = "android.widget.EditText";

    expect(by.type(type)).toEqual({
      using: "class",
      value: type
    });
  });
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

  it("supports simple queries", () => {
    const type = "XCUIElementTypeTextField";

    expect(by.type(type)).toEqual({
      using: "class",
      value: type
    });
  });
});