jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setContext' method on the Appium Service", async () => {
  const contextId = "WEBVIEW_41490.2";

  jest.spyOn(appiumService, "setContext").mockResolvedValue(null);

  await device.switchContext(contextId);

  expect(appiumService.setContext).toHaveBeenCalledWith({ contextId });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);
  const contextId = "WEBVIEW_41490.2";

  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.switchContext(contextId);
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to set context to '${contextId}'.`);
  }

  expect(appiumService.setContext).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.switchContext("NATIVE_APP");
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.setContext).toHaveBeenCalledTimes(1);
});