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
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

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