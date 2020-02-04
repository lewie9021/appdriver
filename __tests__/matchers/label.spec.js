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
    const label = "list-item-0";

    expect(by.label(label)).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports regex queries", () => {
    expect(by.label(/list-item-*/)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionMatches("list-item-*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.label(/LIST-ITEM-*/i)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionMatches("(?i)LIST-ITEM-*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const label = "list-item-0";

    expect(by.label(label)).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports regex queries", () => {
    expect(by.label(/list-item-*/)).toEqual({
      using: "-ios predicate string",
      value: `name MATCHES 'list-item-*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.label(/LIST-ITEM-*/i)).toEqual({
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
      by.label("button");
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});