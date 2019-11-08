jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getOrientation' on the Appium Service", async () => {
  const orientation = "PORTRAIT";
  jest.spyOn(appiumService, "getOrientation").mockResolvedValue(orientation);

  const result = await device.getOrientation();

  expect(result).toEqual(orientation);
  expect(appiumService.getOrientation).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getOrientation").mockRejectedValue(error);

  await expect(device.getOrientation())
    .rejects.toThrow(new ActionError("Failed to get device orientation."));

  expect(appiumService.getOrientation).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getOrientation").mockRejectedValue(error);

  await expect(device.getOrientation())
    .rejects.toThrow(error);

  expect(appiumService.getOrientation).toHaveBeenCalled();
});