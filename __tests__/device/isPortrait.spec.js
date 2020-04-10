jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns true when 'getOrientation' on the Appium Service returns 'PORTRAIT'", async () => {
  const orientation = "PORTRAIT";
  jest.spyOn(appiumService, "getOrientation").mockResolvedValue(orientation);

  const result = await device.isPortrait();

  expect(result).toEqual(true);
  expect(appiumService.getOrientation).toHaveBeenCalledTimes(1);
});

it("returns false when 'getOrientation' on the Appium Service returns 'LANDSCAPE'", async () => {
  const orientation = "LANDSCAPE";
  jest.spyOn(appiumService, "getOrientation").mockResolvedValue(orientation);

  const result = await device.isPortrait();

  expect(result).toEqual(false);
  expect(appiumService.getOrientation).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.isPortrait();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to get device orientation.");
  }

  expect(appiumService.getOrientation).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.isPortrait();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getOrientation).toHaveBeenCalledTimes(1);
});