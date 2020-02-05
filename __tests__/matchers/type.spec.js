jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const type = "android.widget.EditText";

    expect(by.type(type)).toEqual({
      using: "class name",
      value: type
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const type = "XCUIElementTypeTextField";

    expect(by.type(type)).toEqual({
      using: "class name",
      value: type
    });
  });
});