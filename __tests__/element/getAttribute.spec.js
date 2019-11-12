jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the element's attribute value", async () => {
  const ref = createFindElementMock();
  const name = "name";
  const value = "value";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue(value);

  const result = await element(by.label("box")).getAttribute(name);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledWith(expect.objectContaining({ element: ref, attribute: name }));
  expect(result).toEqual(value);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue({ x: 100, y: 200 });
  expect.assertions(4);

  try {
    await element(by.label("box")).getAttribute("name");
  } catch (error) {
    expect(error).toBeInstanceOf(ElementNotFoundError);
    expect(error).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).getAttribute("name");
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to get element attribute.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementAttribute").mockResolvedValue({ x: 300, y: 50 });
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .getAttribute("name");
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementAttribute").mockRejectedValue(error);

  await expect(element(by.label("box")).getAttribute("name"))
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementAttribute).toHaveBeenCalledTimes(1);
});