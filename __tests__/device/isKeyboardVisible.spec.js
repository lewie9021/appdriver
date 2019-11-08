jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getKeyboardVisible' on the Appium Service", async () => {
  const visible = true;
  jest.spyOn(appiumService, "getKeyboardVisible").mockResolvedValue(visible);

  const result = await device.isKeyboardVisible();

  expect(result).toEqual(visible);
  expect(appiumService.getKeyboardVisible).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getKeyboardVisible").mockRejectedValue(error);

  await expect(device.isKeyboardVisible())
    .rejects.toThrow(new ActionError("Failed to get keyboard visibility status."));

  expect(appiumService.getKeyboardVisible).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getKeyboardVisible").mockRejectedValue(error);

  await expect(device.isKeyboardVisible())
    .rejects.toThrow(error);

  expect(appiumService.getKeyboardVisible).toHaveBeenCalled();
});