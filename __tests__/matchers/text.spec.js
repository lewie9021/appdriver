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
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

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