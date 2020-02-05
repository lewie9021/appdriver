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

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.css("#text-input");
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("throws a NotImplementedError", async () => {
    expect.assertions(2);

    try {
      by.css("#text-input");
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("supports simple queries", () => {
    const css = "#text-input";

    expect(by.css(css)).toEqual({
      using: "css selector",
      value: css
    });
  });
});