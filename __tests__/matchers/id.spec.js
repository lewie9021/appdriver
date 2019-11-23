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
    const id = "button";

    expect(by.id(id)).toEqual({
      using: "id",
      value: id
    });
  });

  it.todo("supports 'ends with' queries");

  it.todo("supports 'contains' queries");
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

  it("supports simple queries", () => {
    const id = "button";

    expect(by.id(id)).toEqual({
      using: "id",
      value: id
    });
  });

  it.todo("supports 'ends with' queries");

  it.todo("supports 'contains' queries");
});