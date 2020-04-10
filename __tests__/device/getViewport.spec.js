jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getViewport' on the Appium Service", async () => {
  const viewport = { width: 640, height: 480 };
  jest.spyOn(appiumService, "getViewport").mockResolvedValue(viewport);

  const result = await device.getViewport();

  expect(result).toEqual(viewport);
  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getViewport").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getViewport();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to get viewport.");
  }

  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getViewport").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getViewport();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
});