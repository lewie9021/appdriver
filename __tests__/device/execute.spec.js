jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'execute' method on the Appium Service", async () => {
  const script = "mobile:getDateTime";
  const args = [{ format: "YYYY-MM" }];

  jest.spyOn(appiumService, "execute").mockResolvedValue(null);

  await device.execute(script, ...args);

  expect(appiumService.execute).toHaveBeenCalledWith({ script, args });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);
  const script = "mobile:getDateTime";

  jest.spyOn(appiumService, "execute").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.execute(script, { format: "YYYY-MM" });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", `Failed to execute script '${script}'.`);
  }

  expect(appiumService.execute).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "execute").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.execute("mobile:getDateTime");
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.execute).toHaveBeenCalledTimes(1);
});