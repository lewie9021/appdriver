jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform, setConfig } = require("../helpers");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by } = require("../../main");

beforeEach(() => {
  setPlatform("iOS");
  setConfig({ findInterval: 200, findTimeout: 1000 });
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's existence status", async () => {
  const ref = createFindElementMock();
  const matcher = by.label("box");
  const exists = true;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(exists);

  const result = await element(matcher).exists();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledWith(expect.objectContaining({ matcher }));
  expect(result).toEqual(exists);
});

it("calls 'getElementExists' even if finding the element failed", async () => {
  const matcher = by.label("box");
  const error = new AppiumError("Request error.", 7);
  const exists = true;

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(exists);

  const result = await element(matcher).exists();

  expect(appiumService.findElement).toHaveBeenCalled();
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledWith(expect.objectContaining({ matcher }));
  expect(result).toEqual(exists);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).exists();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to retrieve existence status of element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await element(by.label("button"))
      .tap()
      .exists();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).exists();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
});