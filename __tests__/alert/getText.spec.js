jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { alert } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getAlertText' on the Appium Service", async () => {
  const text = [
    "Alert",
    "Hello World!"
  ].join("\n");
  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);

  const result = await alert.getText();

  expect(result).toEqual(text);
  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getAlertText").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.getText();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to get alert text.");
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getAlertText").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await alert.getText();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
});