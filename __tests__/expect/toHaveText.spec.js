jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, expect: assert } = require("../../");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

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