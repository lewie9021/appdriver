jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, expect: assert } = require("../../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("doesn't throw if expectation is met", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(true);

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeFocused())
    .resolves.toEqual(undefined);
});

it("inverses the expectation when used with .not", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(false);

  const $element = await element(by.label("button"));

  await expect(assert($element).not.toBeFocused())
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(false);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toBeFocused();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", "Expected element to be focused.");
  }
});

it("throws if expectation is not met when used with .not", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(true);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).not.toBeFocused();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", "Expected element not to be focused.");
  }
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockRejectedValue(error);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toBeFocused();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to retrieve focused status of element.");
  }
});
