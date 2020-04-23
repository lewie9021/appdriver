jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { alert } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getAlertVisible' on the Appium Service", async () => {
  const visible = true;
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(visible);

  const result = await alert.isVisible();

  expect(result).toEqual(visible);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getAlertVisible").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.isVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to get visibility status of alert.");
  }

  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getAlertVisible").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.isVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(1);
});