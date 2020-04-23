jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { alert } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setAlertValue' method on the Appium Service", async () => {
  const value = "Hello world!";

  jest.spyOn(appiumService, "setAlertValue").mockResolvedValue(null);

  await alert.setValue(value);

  expect(appiumService.setAlertValue).toHaveBeenCalledWith({ value });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "setAlertValue").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.setValue();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to set alert value.`);
  }

  expect(appiumService.setAlertValue).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setAlertValue").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.setValue();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.setAlertValue).toHaveBeenCalledTimes(1);
});