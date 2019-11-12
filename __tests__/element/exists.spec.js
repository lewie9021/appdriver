jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, AppiumError } = require("../../src/errors");
const { element, by } = require("../../");

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

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledWith(expect.objectContaining({ matcher }));
  expect(result).toEqual(exists);
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
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
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

  await expect(element(by.label("box")).exists())
    .rejects.toThrow(error);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(1);
});