jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's visibility status", async () => {
  const ref = createFindElementMock();
  const visible = true;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisible").mockResolvedValue(visible);

  const result = await element(by.label("box")).isVisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
  expect(result).toEqual(visible);
});

it("returns 'false' if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementVisible").mockResolvedValue(false);

  const result = await element(by.label("box")).isVisible();

  expect(result).toEqual(false);
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisible").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).isVisible();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to retrieve visibility status of element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementVisible").mockResolvedValue({ x: 300, y: 50 });
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .isVisible();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisible").mockRejectedValue(error);

  await expect(element(by.label("box")).isVisible())
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisible).toHaveBeenCalledTimes(1);
});