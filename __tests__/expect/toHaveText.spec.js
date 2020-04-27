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
    const text = "Hello World!";

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementText").mockResolvedValue(text);

    const $element = await element(by.label("button"));

    await expect(assert($element).toHaveText(text))
      .resolves.toEqual(undefined);

    await expect(assert($element).toHaveText(/Hello World!/i))
      .resolves.toEqual(undefined);
  });

  it("inverses the expectation when used with .not", async () => {
    const ref = createFindElementMock();

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementText").mockResolvedValue("Hello World!");

    const $element = await element(by.label("button"));

    await expect(assert($element).not.toHaveText("Test"))
      .resolves.toEqual(undefined);

    await expect(assert($element).not.toHaveText(/Test/))
      .resolves.toEqual(undefined);
  });

  it("throws if expectation is not met", async () => {
    const ref = createFindElementMock();
    const actualText = "Hello World!";
    const expectedText = "Some Text";
    const expectedPattern = /Test/;

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementText").mockResolvedValue(actualText);

    const $element = await element(by.label("button"));

    await expect(assert($element).toHaveText(expectedText))
      .rejects.toThrow(new Error(`Expected element to have text '${expectedText}' but instead got '${actualText}'.`));

    await expect(assert($element).toHaveText(expectedPattern))
      .rejects.toThrow(new Error(`Expected element to have text match '${expectedPattern}'.`));
  });

  it("throws if expectation is not met when used with .not", async () => {
    const ref = createFindElementMock();
    const expectedText = "Hello World!";
    const expectedPattern = /^Hello World!$/;

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementText").mockResolvedValue(expectedText);

    const $element = await element(by.label("button"));

    await expect(assert($element).not.toHaveText(expectedText))
      .rejects.toThrow(new Error(`Expected element not to have text '${expectedText}'.`));

    await expect(assert($element).not.toHaveText(expectedPattern))
      .rejects.toThrow(new Error(`Expected element not to have text match '${expectedPattern}'.`));
  });

  // TODO: Could maybe wrap the error?
  it("correctly propagates errors", async () => {
    const ref = createFindElementMock();
    const error = new AppiumError("Request error.", 3);

    jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
    jest.spyOn(appiumService, "getElementText").mockRejectedValue(error);
    expect.assertions(2);

    try {
      const $element = await element(by.label("button"));

      await assert($element).toHaveText("Hello World!");
    } catch (err) {
      expect(err).toBeInstanceOf(ElementActionError);
      expect(err).toHaveProperty("message", "Failed to get element text.");
    }
  });
});

describe("Alert", () => {
  it("doesn't throw if expectation is met", async () => {
    const text = "Hello World!";

    jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);

    await expect(assert(alert).toHaveText(text))
      .resolves.toEqual(undefined);

    await expect(assert(alert).toHaveText(/Hello World!/i))
      .resolves.toEqual(undefined);
  });

  it("inverses the expectation when used with .not", async () => {
    jest.spyOn(appiumService, "getAlertText").mockResolvedValue("Hello World!");

    await expect(assert(alert).not.toHaveText("Test"))
      .resolves.toEqual(undefined);

    await expect(assert(alert).not.toHaveText(/Test/))
      .resolves.toEqual(undefined);
  });

  it("throws if expectation is not met", async () => {
    const actualText = "Hello World!";
    const expectedText = "Some Text";
    const expectedPattern = /Test/;

    jest.spyOn(appiumService, "getAlertText").mockResolvedValue(actualText);

    await expect(assert(alert).toHaveText(expectedText))
      .rejects.toThrow(new Error(`Expected alert to have text '${expectedText}' but instead got '${actualText}'.`));

    await expect(assert(alert).toHaveText(expectedPattern))
      .rejects.toThrow(new Error(`Expected alert to have text match '${expectedPattern}'.`));
  });

  it("throws if expectation is not met when used with .not", async () => {
    const expectedText = "Hello World!";
    const expectedPattern = /^Hello World!$/;

    jest.spyOn(appiumService, "getAlertText").mockResolvedValue(expectedText);

    await expect(assert(alert).not.toHaveText(expectedText))
      .rejects.toThrow(new Error(`Expected alert not to have text '${expectedText}'.`));

    await expect(assert(alert).not.toHaveText(expectedPattern))
      .rejects.toThrow(new Error(`Expected alert not to have text match '${expectedPattern}'.`));
  });
});