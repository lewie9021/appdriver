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

    expect(by.text(label)).toEqual({
      using: `-android uiautomator`,
      value: `new UiSelector().text("${label}")`
    });
  });

  it("supports regex queries", () => {
    expect(by.text(/list-item-*/)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textMatches("list-item-*")`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.text(/LIST-ITEM-*/i)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textMatches("(?i)LIST-ITEM-*")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("supports simple queries", () => {
    const label = "list-item-0";

    expect(by.text(label)).toEqual({
      using: "-ios predicate string",
      value: `label = '${label}'`
    });
  });

  it("supports regex queries", () => {
    expect(by.text(/list-item-*/)).toEqual({
      using: "-ios predicate string",
      value: `label MATCHES 'list-item-*'`
    });
  });

  it("supports case-insensitive regex queries", () => {
    expect(by.text(/LIST-ITEM-*/i)).toEqual({
      using: "-ios predicate string",
      value: `label MATCHES[c] 'LIST-ITEM-*'`
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.text("Hello World!");
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});