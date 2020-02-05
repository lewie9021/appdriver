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
    const id = "list-item-0";

    expect(by.id(id)).toEqual({
      using: "id",
      value: id
    });
  });

  it("supports regex queries", () => {
    expect(by.id(/list-item-*/)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().resourceIdMatches("list-item-*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.id(/LIST-ITEM-*/i)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().resourceIdMatches("(?i)LIST-ITEM-*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const id = "list-item-0";

    expect(by.id(id)).toEqual({
      using: "id",
      value: id
    });
  });

  it("supports regex queries", () => {
    expect(by.id(/list-item-*/)).toEqual({
      using: "-ios predicate string",
      value: `name MATCHES 'list-item-*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.id(/LIST-ITEM-*/i)).toEqual({
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
      by.id("button");
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});