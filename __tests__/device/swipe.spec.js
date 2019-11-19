jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device, gestures } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'performActions' method on the Appium Service with a swipe gesture", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const direction = 270;
  const swipeGesture = gestures.swipe({ x, y, distance, direction });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipe({ x, y, distance, direction });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeGesture.resolve() });
});

it("defines the swipe duration between (x, y) and (dest.x, dest.y) when 'duration' is passed", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const direction = 90;
  const duration = 1000;
  const swipeGesture = gestures.swipe({ x, y, distance, direction, duration });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipe({ x, y, distance, direction, duration });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeGesture.resolve() });
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const distance = 100;
  const direction = 90;
  const swipeGesture = gestures.swipe({ x: 0, y: 0, distance, direction });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipe({ distance, direction });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeGesture.resolve() });
});

it("defaults 'duration' parameter to 50", async () => {
  const x = 100;
  const y = 50;
  const distance = 100;
  const direction = 90;
  const swipeGesture = gestures.swipe({ x, y, distance, direction, duration: 50 });

  jest.spyOn(appiumService, "performActions").mockResolvedValue(null);

  await device.swipe({ x, y, distance, direction });

  expect(appiumService.performActions).toHaveBeenCalledWith({ actions: await swipeGesture.resolve() });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.swipe({ distance: 100, direction: 180 });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to perform swipe gesture.");
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "performActions").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.swipe({ distance: 100, direction: 180 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.performActions).toHaveBeenCalledTimes(1);
});