jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, expect: assert } = require("../../");

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
    expect(err).toHaveProperty("message", `Expected element to have value '${expectedValue}' but instead got '${actualValue}'.`);
  }
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
    expect(err).toHaveProperty("message", "Failed to get element value.");
  }
});