jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's location", async () => {
  const ref = createFindElementMock();
  const location = { x: 200, y: 150 };

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementLocation").mockResolvedValue(location);

  const result = await element(by.label("box")).getLocation();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
  expect(result).toEqual(location);
});

it("supports passing a 'relative' parameter", async () => {
  const ref = createFindElementMock();
  const location = { x: 50, y: 300 };
  const relative = true;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementLocation").mockResolvedValue(location);

  const result = await element(by.label("box")).getLocation({ relative });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledWith(expect.objectContaining({ element: ref, relative }));
  expect(result).toEqual(location);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementLocation").mockResolvedValue({ x: 100, y: 200 });
  expect.assertions(4);

  try {
    await element(by.label("box")).getLocation();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementLocation").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).getLocation();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to get element location.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementLocation").mockResolvedValue({ x: 300, y: 50 });
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .getLocation();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementLocation").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).getLocation();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementLocation).toHaveBeenCalledTimes(1);
});