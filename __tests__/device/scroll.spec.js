jest.mock("../../src/worker/services/appdriverService");

const appdriverService = require("../../src/worker/services/appdriverService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'performActions' method on the Appium Service with the given 'gesture'", async () => {
  const x = 100;
  const y = 200;
  const direction = 180;
  const distance = 300;

  jest.spyOn(appdriverService, "scroll").mockResolvedValue(null);

  await device.scroll({ x, y, direction, distance });

  expect(appdriverService.scroll).toHaveBeenCalledWith({ x, y, direction, distance });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appdriverService, "scroll").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.scroll({ x: 100, y: 100, direction: 180, distance: 200 });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to perform scroll gesture.");
  }

  expect(appdriverService.scroll).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appdriverService, "scroll").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.scroll({ x: 100, y: 100, direction: 180, distance: 200 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appdriverService.scroll).toHaveBeenCalledTimes(1);
});