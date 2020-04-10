jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by } = require("../../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's disabled status", async () => {
  const ref = createFindElementMock();
  const enabled = false;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementEnabledAttribute").mockResolvedValue(enabled);

  const result = await element(by.label("input")).isDisabled();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementEnabledAttribute).toHaveBeenCalledTimes(1);
  expect(result).toEqual(!enabled);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementEnabledAttribute").mockResolvedValue(false);
  expect.assertions(4);

  try {
    await element(by.label("input")).isDisabled();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "input".`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementEnabledAttribute).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementEnabledAttribute").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).isDisabled();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to retrieve disabled status of element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementEnabledAttribute).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementEnabledAttribute").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .isDisabled();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementEnabledAttribute).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementEnabledAttribute").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).isDisabled();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementEnabledAttribute).toHaveBeenCalledTimes(1);
});