jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { NotSupportedError } = require("../../src/worker/errors");
const Matcher = require("../../src/worker/Matcher");
const { by } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a Matcher instance", () => {
  const predicate = "type = 'XCUIElementTypeTextField'";
  const matcher = by.iosPredicate(predicate);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("ios predicate");
  expect(matcher.value).toEqual(predicate);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.iosPredicate("type = 'android.widget.EditText'").resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const predicate = "type = 'XCUIElementTypeTextField'";

    expect(by.iosPredicate(predicate).resolve()).toEqual({
      using: "-ios predicate string",
      value: predicate
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.iosPredicate("type = 'div'").resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }
  });
});