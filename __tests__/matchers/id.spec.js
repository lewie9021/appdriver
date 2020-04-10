jest.mock("../../src/worker/stores/sessionStore");

const { setPlatform } = require("../helpers");
const { NotImplementedError } = require("../../src/worker/errors");
const Matcher = require("../../src/worker/Matcher");
const { by } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a Matcher instance", () => {
  const id = "test";
  const matcher = by.id(id);

  expect(matcher).toBeInstanceOf(Matcher);
  expect(matcher.type).toEqual("id");
  expect(matcher.value).toEqual(id);
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("supports simple queries", () => {
    const id = "list-item-0";

    expect(by.id(id).resolve()).toEqual({
      using: "id",
      value: id
    });
  });

  it("supports regex queries", () => {
    expect(by.id(/list-item-*/).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().resourceIdMatches("list-item-*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.id(/LIST-ITEM-*/i).resolve()).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().resourceIdMatches("(?i)LIST-ITEM-*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const id = "list-item-0";

    expect(by.id(id).resolve()).toEqual({
      using: "id",
      value: id
    });
  });

  it("supports regex queries", () => {
    expect(by.id(/list-item-*/).resolve()).toEqual({
      using: "-ios predicate string",
      value: `name MATCHES 'list-item-*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.id(/LIST-ITEM-*/i).resolve()).toEqual({
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
      by.id("button").resolve();
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});