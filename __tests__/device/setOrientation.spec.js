jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setOrientation' method on the Appium Service", async () => {
  const orientation = "PORTRAIT";
  jest.spyOn(appiumService, "setOrientation").mockResolvedValue(null);

  await device.setOrientation(orientation);

  expect(appiumService.setOrientation).toHaveBeenCalledWith({ orientation });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);
  const orientation = "PORTRAIT";

  jest.spyOn(appiumService, "setOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.setOrientation(orientation);
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to set device orientation to '${orientation}'.`);
  }

  expect(appiumService.setOrientation).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.setOrientation("LANDSCAPE");
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.setOrientation).toHaveBeenCalledTimes(1);
});