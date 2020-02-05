jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setContext' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "setContext").mockResolvedValue(null);

  await device.switchToNativeContext();

  expect(appiumService.setContext).toHaveBeenCalledWith({ contextId: "NATIVE_APP" });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.switchToNativeContext();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to switch to the native context.`);
  }

  expect(appiumService.setContext).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.switchToNativeContext();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.setContext).toHaveBeenCalledTimes(1);
});