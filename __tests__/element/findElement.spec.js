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

it("modifies the internal element reference to the newly found element", async () => {
  const ref = createFindElementMock({ elementId: "elementId" });
  const ref2 = createFindElementMock({ elementId: "innerElementId" });

  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref2);

  const result = await element(by.label("screen")).findElement(by.label("input"));

  expect(appiumService.findElement).toHaveBeenCalledTimes(2);
  await expect(result.value).resolves.toEqual({ matcher: null, ref: ref2 });
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  expect.assertions(3);

  try {
    await element(by.label("screen")).findElement(by.label("input"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "screen".`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  expect.assertions(3);

  try {
    await element(by.label("screen")).findElement(by.label("input"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to find element from element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(2);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock({ elementId: "31000000-0000-0000-CC4E-000000000000" });
  const ref2 = createFindElementMock({ elementId: "45000000-0000-0000-W6AJ-000000000000" });
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref2);
  expect.assertions(4);

  try {
    await element(by.label("screen"))
      .tap()
      .findElement(by.label("input"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  expect.assertions(3);

  try {
    await element(by.label("screen")).findElement(by.label("input"));
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(2);
});