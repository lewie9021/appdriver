jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'hideKeyboard' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "hideKeyboard").mockResolvedValue(null);

  await device.hideKeyboard();

  expect(appiumService.hideKeyboard).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "hideKeyboard").mockRejectedValue(error);

  await expect(device.hideKeyboard())
    .rejects.toThrow(new ActionError("Failed to hide keyboard."));

  expect(appiumService.hideKeyboard).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "hideKeyboard").mockRejectedValue(error);

  await expect(device.hideKeyboard())
    .rejects.toThrow(error);

  expect(appiumService.hideKeyboard).toHaveBeenCalled();
});