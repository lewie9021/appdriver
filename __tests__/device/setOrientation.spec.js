jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError, NotImplementedError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
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

  await expect(device.setOrientation(orientation))
    .rejects.toThrow(new ActionError(`Failed to set device orientation to '${orientation}'.`));

  expect(appiumService.setOrientation).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "setOrientation").mockRejectedValue(error);

  await expect(device.setOrientation("LANDSCAPE"))
    .rejects.toThrow(error);

  expect(appiumService.setOrientation).toHaveBeenCalled();
});