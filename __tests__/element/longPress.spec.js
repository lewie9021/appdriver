jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { Element } = require("../../src/Element");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'longPressElement' method on the Appium Service", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  await element(by.label("button")).longPress();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  const $element = await element(by.label("button")).longPress();

  expect($element).toBeInstanceOf(Element);
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  await element(by.label("button")).longPress();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledWith(expect.objectContaining({ x: 0, y: 0 }));
});

it("defaults the 'duration' parameter to 750", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  await element(by.label("button")).longPress();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledWith(expect.objectContaining({ duration: 750 }));
});

it("supports passing 'x' and 'y' parameters to offset from the top left of the element", async () => {
  const ref = createFindElementMock();
  const x = 100;
  const y = 300;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  await element(by.label("button")).longPress({ x, y });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledWith(expect.objectContaining({ x, y }));
});

it("supports passing a 'duration' parameter to redefine the press duration", async () => {
  const ref = createFindElementMock();
  const duration = 1000;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);

  await element(by.label("button")).longPress({ duration });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledWith(expect.objectContaining({ duration }));
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("box")).longPress();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementNotFoundError);
    expect(error).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).longPress();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to long press element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "sendElementKeys").mockRejectedValue(error);
  jest.spyOn(appiumService, "longPressElement").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .longPress();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.sendElementKeys).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "longPressElement").mockRejectedValue(error);

  await expect(element(by.label("box")).longPress())
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.longPressElement).toHaveBeenCalledTimes(1);
});