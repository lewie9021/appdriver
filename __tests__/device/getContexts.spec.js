jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getContexts' on the Appium Service", async () => {
  const contexts = [{ id: "NATIVE_APP", title: null, url: null }];
  jest.spyOn(appiumService, "getContexts").mockResolvedValue(contexts);

  const result = await device.getContexts();

  expect(result).toEqual(contexts);
  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getContexts").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getContexts();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to get contexts.`);
  }

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getContexts").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getContexts();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
});