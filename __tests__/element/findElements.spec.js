jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock, createFindElementsMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a list of matching elements", async () => {
  const ref = createFindElementMock();
  const refs = createFindElementsMock({ elementIds: ["innerElementId", "innerElementId2"] });

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "findElements").mockResolvedValue(refs);

  const result = await element(by.label("screen")).findElements(by.label("button"));

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.findElements).toHaveBeenCalledTimes(1);
  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(2);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const ref = createFindElementsMock();
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "findElements").mockResolvedValue(ref);
  expect.assertions(4);

  try {
    await element(by.label("screen")).findElements(by.label("button"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.findElements).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "findElements").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("screen")).findElements(by.label("button"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to find elements from element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.findElements).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const refs = createFindElementsMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "findElements").mockResolvedValue(refs);
  expect.assertions(5);

  try {
    await element(by.label("screen"))
      .tap()
      .findElements(by.label("button"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.findElements).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "findElements").mockRejectedValue(error);

  await expect(element(by.label("screen")).findElements(by.label("button")))
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.findElements).toHaveBeenCalledTimes(1);
});