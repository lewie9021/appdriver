jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'navigate' method on the Appium Service", async () => {
  const url = "myapp://login?username=test&password=1234";
  jest.spyOn(appiumService, "navigate").mockResolvedValue(null);

  await device.navigate(url);

  expect(appiumService.navigate).toHaveBeenCalledWith({ url });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);
  const url = "myapp://login?username=test&password=1234";

  jest.spyOn(appiumService, "navigate").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.navigate(url);
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to navigate to '${url}'.`);
  }

  expect(appiumService.navigate).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "navigate").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.navigate("myapp://login?username=test&password=1234");
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.navigate).toHaveBeenCalledTimes(1);
});