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

  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
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

it("defaults 'y' parameter to 0", async () => {
  const distance = 100;
  const swipeLeftGesture = gestures.swipeLeft({ x: 0, y: 0, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ x: 0, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("defaults 'x' parameter to the distance parameter", async () => {
  const distance = 100;
  const swipeLeftGesture = gestures.swipeLeft({ x: distance, y: 0, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ y: 0, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeLeftGesture.resolve() });
});

it("defaults 'x' parameter to the percentage parameter", async () => {
  const percentage = 0.5;
  const viewport = { width: 640, height: 480 };
  const swipeUpGesture = gestures.swipeLeft({ x: viewport.width * percentage, y: 0, distance: viewport.width * percentage });

  jest.spyOn(appiumService, "getViewport").mockResolvedValue(viewport);
  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeLeft({ y: 0, percentage });

  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeUpGesture.resolve() });
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
  expect.assertions(3);

  try {
    await device.swipeLeft({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to perform swipe left gesture.");
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.swipeLeft({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});