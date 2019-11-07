jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError, NotImplementedError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.restoreAllMocks();
});

it("executes the 'goBack' method on the Appium Service", async () => {
  jest.spyOn(appiumService, "goBack").mockResolvedValue(null);

  await device.goBack();

  expect(appiumService.goBack).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "goBack").mockRejectedValue(error);

  await expect(device.goBack())
    .rejects.toThrow(new ActionError("Failed to go back."));

  expect(appiumService.goBack).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new NotImplementedError();

  jest.spyOn(appiumService, "goBack").mockRejectedValue(error);

  await expect(device.goBack())
    .rejects.toThrow(error);

  expect(appiumService.goBack).toHaveBeenCalled();
});