jest.mock("../../src/worker/services/appiumService");jest.mock("../../src/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android"));

  it("supports simple queries", () => {
    const text = "button";

    expect(by.text(text)).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().text("${text}")`
    });
  });

  it("supports 'ends with' queries", () => {
    expect(by.text("button-*")).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textStartsWith("button-")`
    });
  });

  it("supports 'contains' queries", () => {
    expect(by.text("*button*")).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().textContains("button")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

  it("supports simple queries", () => {
    const text = "button";

    expect(by.text(text)).toEqual({
      using: "-ios predicate string",
      value: `label = '${text}'`
    });
  });

  it("supports 'ends with' queries", () => {
    expect(by.text("button-*")).toEqual({
      using: "-ios predicate string",
      value: `label BEGINSWITH 'button-'`
    });
  });

  it("supports 'contains' queries", () => {
    expect(by.text("*button*")).toEqual({
      using: "-ios predicate string",
      value: `label CONTAINS 'button'`
    });
  });
});