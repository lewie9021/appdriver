jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform, setConfig } = require("../helpers");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, alert, expect: assert } = require("../../main");

beforeEach(() => {
  setPlatform("iOS");
  setConfig({ findInterval: 200, findTimeout: 1000 });
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Element", () => {
  it("doesn't throw if expectation is met", async () => {
    const ref = createFindElementMock();

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);

    const $element = await element(by.label("button"));

    await expect(assert($element).toBeVisible())
      .resolves.toEqual(undefined);
  });

  it("inverses the expectation when used with .not", async () => {
    const ref = createFindElementMock();

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

    const $element = await element(by.label("button"));

    await expect(assert($element).not.toBeVisible())
      .resolves.toEqual(undefined);
  });

  it("throws if expectation is not met", async () => {
    const ref = createFindElementMock();

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);
    expect.assertions(2);

    try {
      const $element = await element(by.label("button"));

      await assert($element).toBeVisible();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "Expected element to be visible.");
    }
  });

  it("throws if expectation is not met when used with .not", async () => {
    const ref = createFindElementMock();

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);
    expect.assertions(2);

    try {
      const $element = await element(by.label("button"));

      await assert($element).not.toBeVisible();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "Expected element not to be visible.");
    }
  });

  // TODO: Could maybe wrap the error?
  it("correctly propagates errors", async () => {
    const ref = createFindElementMock();
    const error = new AppiumError("Request error.", 3);

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementVisibleAttribute").mockRejectedValue(error);
    expect.assertions(2);

    try {
      const $element = await element(by.label("button"));

      await assert($element).toBeVisible();
    } catch (err) {
      expect(err).toBeInstanceOf(ElementActionError);
      expect(err).toHaveProperty("message", "Failed to retrieve visibility status of element.");
    }
  });
});

describe("Alert", () => {
  it("doesn't throw if expectation is met", async () => {
    jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(true);

    await expect(assert(alert).toBeVisible())
      .resolves.toEqual(undefined);
  });

  it("inverses the expectation when used with .not", async () => {
    jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(false);

    await expect(assert(alert).not.toBeVisible())
      .resolves.toEqual(undefined);
  });

  it("throws if expectation is not met", async () => {
    jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(false);
    expect.assertions(2);

    try {
      await assert(alert).toBeVisible();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "Expected alert to be visible.");
    }
  });

  it("throws if expectation is not met when used with .not", async () => {
    jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(true);
    expect.assertions(2);

    try {
      await assert(alert).not.toBeVisible();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty("message", "Expected alert not to be visible.");
    }
  });
});