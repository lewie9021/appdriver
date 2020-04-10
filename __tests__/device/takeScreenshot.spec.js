jest.mock("fs");
jest.mock("../../src/worker/services/appiumService");

const fs = require("fs");
const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a buffer containing the result of 'takeScreenshot' on the Appium Service", async () => {
  const screenshot = "dGVzdA==";

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue(screenshot);

  const result = await device.takeScreenshot();

  expect(result).toBeInstanceOf(Buffer);
  expect(result.toString("base64")).toEqual(screenshot);
  expect(appiumService.takeScreenshot).toHaveBeenCalledTimes(1);
});

it("stores the screenshot on disk if a 'filePath' is configured", async () => {
  const filePath = "some/path";

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb());

  const buffer = await device.takeScreenshot({ filePath });

  expect(fs.writeFile).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "takeScreenshot").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to take screenshot.");
  }

  expect(appiumService.takeScreenshot).toHaveBeenCalledTimes(1);
});

it("throws an ActionError if it is unable to store on disk when a 'filePath' is configured", async () => {
  const error = new Error("File system error.");

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb(error));
  expect.assertions(4);

  try {
    await device.takeScreenshot({ filePath: "some/path" });
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to store screenshot on disk.");
  }

  expect(appiumService.takeScreenshot).toHaveBeenCalledTimes(1);
  expect(fs.writeFile).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "takeScreenshot").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.takeScreenshot).toHaveBeenCalledTimes(1);
});