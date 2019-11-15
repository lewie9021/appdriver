jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError, NotImplementedError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'goBack' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "goBack").mockResolvedValue(null);

  await device.goBack();

  expect(appiumService.goBack).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "goBack").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.goBack();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to go back.");
  }

  expect(appiumService.goBack).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new NotImplementedError();

  jest.spyOn(appiumService, "goBack").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.goBack();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.goBack).toHaveBeenCalledTimes(1);
});