jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device, gestures } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'performActions' method on the Appium Service with a swipe left gesture", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const swipeLeftGesture = gestures.swipeLeft({ x, y, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ x, y, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("converts the 'percentage' parameter to a distance relative to the device viewport", async () => {
  const x = 100;
  const y = 50;
  const percentage = 0.5;
  const viewport = { width: 640, height: 480 };
  const swipeLeftGesture = gestures.swipeLeft({ x, y, distance: viewport.width * percentage });

  jest.spyOn(appiumService, "getViewport").mockResolvedValue(viewport);
  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ x, y, percentage });

  expect(appiumService.getViewport).toHaveBeenCalled();
  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("defines the swipe up duration between (x, y) and (dest.x, dest.y) when 'duration' is passed", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const duration = 1000;
  const swipeLeftGesture = gestures.swipeLeft({ x, y, distance, duration });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ x, y, distance, duration });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

// TODO: Note that it no longer derives the x value from the percentage / distance.
it("defaults 'x' and 'y' parameters to 0", async () => {
  const distance = 100;
  const swipeLeftGesture = gestures.swipeLeft({ x: 0, y: 0, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("defaults 'duration' parameter to 50", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const swipeLeftGesture = gestures.swipeLeft({ x, y, distance, duration: 50 });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ x, y, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);

  await expect(device.swipeLeft({ distance: 100 }))
    .rejects.toThrow(new ActionError("Failed to perform swipe left gesture."));

  expect(appiumService.performActions).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);

  await expect(device.swipeLeft({ distance: 100 }))
    .rejects.toThrow(error);

  expect(appiumService.performActions).toHaveBeenCalled();
});