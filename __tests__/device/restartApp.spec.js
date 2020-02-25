jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'restartApp' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "restartApp").mockResolvedValue(null);

  await device.restartApp();

  expect(appiumService.restartApp).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "restartApp").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.restartApp();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to restart the application.");
  }

  expect(appiumService.restartApp).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "restartApp").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.restartApp();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.restartApp).toHaveBeenCalledTimes(1);
});