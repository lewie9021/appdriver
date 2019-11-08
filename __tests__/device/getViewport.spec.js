jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getViewport' on the Appium Service", async () => {
  const viewport = { width: 640, height: 480 };
  jest.spyOn(appiumService, "getViewport").mockResolvedValue(viewport);

  const result = await device.getViewport();

  expect(result).toEqual(viewport);
  expect(appiumService.getViewport).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getViewport").mockRejectedValue(error);

  await expect(device.getViewport())
    .rejects.toThrow(new ActionError("Failed to get device viewport."));

  expect(appiumService.getViewport).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getViewport").mockRejectedValue(error);

  await expect(device.getViewport())
    .rejects.toThrow(error);

  expect(appiumService.getViewport).toHaveBeenCalled();
});