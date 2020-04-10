jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device, gestures } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'performActions' method on the Appium Service with a swipe right gesture", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const swipeRightGesture = gestures.swipeRight({ x, y, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeRight({ x, y, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeRightGesture.resolve() });
});

it("converts the 'percentage' parameter to a distance relative to the device viewport", async () => {
  const x = 100;
  const y = 50;
  const percentage = 0.5;
  const viewport = { width: 640, height: 480 };
  const swipeRightGesture = gestures.swipeRight({ x, y, distance: viewport.width * percentage });

  jest.spyOn(appiumService, "getViewport").mockResolvedValue(viewport);
  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeRight({ x, y, percentage });

  expect(appiumService.getViewport).toHaveBeenCalledTimes(1);
  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeRightGesture.resolve() });
});

it("defines the swipe up duration between (x, y) and (dest.x, dest.y) when 'duration' is passed", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const duration = 1000;
  const swipeRightGesture = gestures.swipeRight({ x, y, distance, duration });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeRight({ x, y, distance, duration });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeRightGesture.resolve() });
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const distance = 100;
  const swipeRightGesture = gestures.swipeRight({ x: 0, y: 0, distance });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeRight({ distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeRightGesture.resolve() });
});

it("defaults 'duration' parameter to 50", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const swipeRightGesture = gestures.swipeRight({ x, y, distance, duration: 50 });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipeRight({ x, y, distance });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeRightGesture.resolve() });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.swipeRight({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to perform swipe right gesture.");
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.swipeRight({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});