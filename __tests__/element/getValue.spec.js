jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's value", async () => {
  const ref = createFindElementMock();
  const value = "Hello World!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(value);

  const result = await element(by.label("input")).getValue();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledWith({ element: ref });
  expect(result).toEqual(value);
});

it("supports passing an 'sliderRange' parameter", async () => {
  const ref = createFindElementMock();
  const sliderRange = [0, 5];
  const value = 2.5;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue(value);

  const result = await element(by.label("slider")).getValue({ sliderRange });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledWith(expect.objectContaining({ options: { sliderRange } }));
  expect(result).toEqual(value);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue("Hello World!");
  expect.assertions(4);

  try {
    await element(by.label("input")).getValue();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementNotFoundError);
    expect(error).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).getValue();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to get element value.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementValue").mockResolvedValue("Hello World!");
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .getValue();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementValue").mockRejectedValue(error);

  await expect(element(by.label("input")).getValue())
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementValue).toHaveBeenCalledTimes(1);
});