jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's width and height", async () => {
  const ref = createFindElementMock();
  const size = { width: 200, height: 150 };

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementSize").mockResolvedValue(size);

  const result = await element(by.label("box")).getSize();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(1);
  expect(result).toEqual(size);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  expect.assertions(4);


  try {
    await element(by.label("box")).getSize();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementNotFoundError);
    expect(error).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementSize").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).getSize();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to get element size.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(1);
});

it.skip("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementSize").mockResolvedValue({ width: 640, height: 480 });
  expect.assertions(4);

  try {
    await element(by.label("box"))
      .tap()
      .getSize();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementSize").mockRejectedValue(error);

  await expect(element(by.label("box")).getSize())
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(1);
});