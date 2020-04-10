jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setOrientation' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "setOrientation").mockResolvedValue(null);

  await device.setLandscape();

  expect(appiumService.setOrientation).toHaveBeenCalledWith({ orientation: "LANDSCAPE" });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "setOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.setLandscape();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to set device orientation to landscape.`);
  }

  expect(appiumService.setOrientation).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setOrientation").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.setLandscape();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.setOrientation).toHaveBeenCalledTimes(1);
});