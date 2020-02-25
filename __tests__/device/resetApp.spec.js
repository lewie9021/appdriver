jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'resetApp' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "resetApp").mockResolvedValue(null);

  await device.resetApp();

  expect(appiumService.resetApp).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "resetApp").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.resetApp();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to reset the application.");
  }

  expect(appiumService.resetApp).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "resetApp").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.resetApp();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.resetApp).toHaveBeenCalledTimes(1);
});