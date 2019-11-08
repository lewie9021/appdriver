jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device, gestures } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'performActions' method on the Appium Service with the given 'gesture'", async () => {
  const gesture = gestures.tap({ x: 100, y: 100 });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.performGesture(gesture);

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await gesture.resolve() });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);

  await expect(device.performGesture(gestures.tap({ x: 100, y: 100 })))
    .rejects.toThrow(new ActionError("Failed to perform gesture."));

  expect(appiumService.performActions).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);

  await expect(device.performGesture(gestures.tap({ x: 100, y: 100 })))
    .rejects.toThrow(error);

  expect(appiumService.performActions).toHaveBeenCalled();
});