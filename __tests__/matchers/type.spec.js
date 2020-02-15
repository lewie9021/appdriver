jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const Matcher = require("../../src/worker/Matcher");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a Matcher instance", () => {
  const type = "XCUIElementTypeTextField";
  const matcher = by.type(type);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("type");
  expect(matcher.value).toEqual(type);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const type = "android.widget.EditText";

    expect(by.type(type).resolve()).toEqual({
      using: "class name",
      value: type
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const type = "XCUIElementTypeTextField";

    expect(by.type(type).resolve()).toEqual({
      using: "class name",
      value: type
    });
  });
});