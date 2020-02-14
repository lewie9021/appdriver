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
  const label = "test";
  const matcher = by.label(label);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("label");
  expect(matcher.value).toEqual(label);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const label = "list-item-0";

    expect(by.label(label).resolve()).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports regex queries", () => {
    expect(by.label(/list-item-*/).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionMatches("list-item-*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.label(/LIST-ITEM-*/i).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionMatches("(?i)LIST-ITEM-*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const label = "list-item-0";

    expect(by.label(label).resolve()).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports regex queries", () => {
    expect(by.label(/list-item-*/).resolve()).toEqual({
      using: "-ios predicate string",
      value: `name MATCHES 'list-item-*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.label(/LIST-ITEM-*/i).resolve()).toEqual({
      using: "-ios predicate string",
      value: `name MATCHES[c] 'LIST-ITEM-*'`
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.label("button").resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});