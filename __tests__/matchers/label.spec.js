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
    const label = "button";

    expect(by.label(label)).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports 'ends with' queries", () => {
    expect(by.label("button-*")).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionStartsWith("button-")`
    });
  });

  it("supports 'contains' queries", () => {
    expect(by.label("*button*")).toEqual({
      using: "-android uiautomator",
      value: `new UiSelector().descriptionContains("button")`
    });
  });
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

  it("supports simple queries", () => {
    const label = "button";

    expect(by.label(label)).toEqual({
      using: "accessibility id",
      value: label
    });
  });

  it("supports 'ends with' queries", () => {
    expect(by.label("button-*")).toEqual({
      using: "-ios predicate string",
      value: `name BEGINSWITH 'button-'`
    });
  });

  it("supports 'contains' queries", () => {
    expect(by.label("*button*")).toEqual({
      using: "-ios predicate string",
      value: `name CONTAINS 'button'`
    });
  });
});