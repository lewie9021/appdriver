jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the result of 'getContext' on the Appium Service", async () => {
  const context = { id: "NATIVE_APP", title: null, url: null };
  jest.spyOn(appiumService, "getContext").mockResolvedValue(context);

  const result = await device.getContext();

  expect(result).toEqual(context);
  expect(appiumService.getContext).toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getContext();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to get context.`);
  }

  expect(appiumService.getContext).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getContext").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.getContext();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getContext).toHaveBeenCalledTimes(1);
});