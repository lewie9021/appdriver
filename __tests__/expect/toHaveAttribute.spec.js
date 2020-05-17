jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform, setConfig } = require("../helpers");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, expect: assert } = require("../../main");

beforeEach(() => {
  setPlatform("iOS");
  setConfig({ findInterval: 200, findTimeout: 1000 });
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("doesn't throw if expectation is met", async () => {
  const ref = createFindElementMock();
  const value = true;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue(value);

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveAttribute("enabled", value))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue(false);

  const $element = await element(by.label("button"));

  await expect(assert($element).not.toHaveAttribute("enabled", true))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  const ref = createFindElementMock();
  const attribute = "value";
  const actualValue = "Hello!";
  const expectedValue = "Hello World!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue(actualValue);
  expect.assertions(2);

  try {
    const $element = await element(by.label("text-input"));

    await assert($element).toHaveAttribute("value", expectedValue);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty(
      "message",
      `Expected element ${attribute} attribute to have value '${expectedValue}' but instead got '${actualValue}'.`
    );
  }
});

it("throws if expectation is not met when used with .not", async () => {
  const ref = createFindElementMock();
  const attribute = "value";
  const value = null;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue(value);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).not.toHaveAttribute(attribute, value);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty(
      "message",
      `Expected element ${attribute} attribute not to have value '${value}'.`
    );
  }
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockRejectedValue(error);
  expect.assertions(2);

  try {
    const $element = await element(by.label("text-input"));

    await assert($element).toHaveAttribute("value", "Hello World!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty(
      "message",
      "Failed to get element attribute."
    );
  }
});
