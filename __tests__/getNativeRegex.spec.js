jest.mock("../src/worker/stores/sessionStore");

const { sessionStore } = require("../src/worker/stores/sessionStore");
const getNativeRegex = require("../src/worker/helpers/getNativeRegex");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("iOS", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS"));

  it("supports regex without flags", () => {
    expect(getNativeRegex(/hello-world/)).toEqual({
      pattern: "hello-world",
      modifiers: ""
    });
  });

  it("returns '[c]' when the case-insensitive flag is used", () => {
    expect(getNativeRegex(/HELLO-WORLD/i)).toEqual({
      pattern: "HELLO-WORLD",
      modifiers: "[c]"
    });
  });

  it("escapes backslashes", () => {
    expect(getNativeRegex(/list-item-\d+/)).toEqual({
      pattern: "list-item-\\\\d+",
      modifiers: ""
    });
  });
});

describe("Android", () => {
  beforeEach(() => jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android"));

  it("supports regex without flags", () => {
    expect(getNativeRegex(/hello-world/)).toEqual({
      pattern: "hello-world",
      modifiers: ""
    });
  });

  it("returns '(?i)' when the case-insensitive flag is used", () => {
    expect(getNativeRegex(/HELLO-WORLD/i)).toEqual({
      pattern: "HELLO-WORLD",
      modifiers: "(?i)"
    });
  });
});