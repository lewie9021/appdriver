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
  const value = "Hello World!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(value);

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue(value))
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(5);

  const $element = await element(by.label("button"));

  await expect(assert($element).not.toHaveValue(10))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  const ref = createFindElementMock();
  const actualValue = "Hello!";
  const expectedValue = "Hello World!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(actualValue);
  expect.assertions(2);

  try {
    const $element = await element(by.label("text-input"));

    await assert($element).toHaveValue(expectedValue);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty(
      "message",
      `Expected element to have value '${expectedValue}' but instead got '${actualValue}'.`
    );
  }
});

it("throws if expectation is not met when used with .not", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(3);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).not.toHaveValue(3);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty(
      "message",
      "Expected element not to have value '3'."
    );
  }
});

it("supports passing .getValue options", async () => {
  const ref = createFindElementMock();
  const value = 2.5;
  const options = { sliderRange: [ 0, 5 ] };

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(value);

  const $element = await element(by.label("text-input"), options);

  await expect(assert($element).toHaveValue(value))
    .resolves.toEqual(undefined);

  expect(appiumService.getElementValue).toHaveBeenCalledWith(expect.objectContaining({ options }));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockRejectedValue(error);
  expect.assertions(2);

  try {
    const $element = await element(by.label("text-input"));

    await assert($element).toHaveValue("Hello World!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty(
      "message",
      "Failed to get element value."
    );
  }
});
