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
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

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