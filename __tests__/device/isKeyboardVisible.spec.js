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
  expect(appiumService.getKeyboardVisible).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getKeyboardVisible").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.isKeyboardVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to get keyboard visibility status.");
  }

  expect(appiumService.getKeyboardVisible).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getKeyboardVisible").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.isKeyboardVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getKeyboardVisible).toHaveBeenCalledTimes(1);
});