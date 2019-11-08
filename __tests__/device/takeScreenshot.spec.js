jest.mock("fs");
jest.mock("../../src/services/appiumService");

const fs = require("fs");
const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError, NotImplementedError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.restoreAllMocks();
});


it("returns a buffer containing the result of 'takeScreenshot' on the Appium Service", async () => {
  const screenshot = "dGVzdA==";

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue(screenshot);

  const result = await device.takeScreenshot();

  expect(result).toBeInstanceOf(Buffer);
  expect(result.toString("base64")).toEqual(screenshot);
  expect(appiumService.takeScreenshot).toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "takeScreenshot").mockRejectedValue(error);

  await expect(device.takeScreenshot())
    .rejects.toThrow(new ActionError("Failed to take screenshot."));

  expect(appiumService.takeScreenshot).toHaveBeenCalled();
});

it("throws an ActionError if it is unable to store on disk when a 'filePath' is configured", async () => {
  const error = new Error("File system error.");

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb(error));

  await expect(device.takeScreenshot({ filePath: "some/path" }))
    .rejects.toThrow(new ActionError("Failed to store screenshot on disk."));

  expect(appiumService.takeScreenshot).toHaveBeenCalled();
  expect(fs.writeFile).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new NotImplementedError();

  jest.spyOn(appiumService, "takeScreenshot").mockRejectedValue(error);

  await expect(device.takeScreenshot())
    .rejects.toThrow(error);

  expect(appiumService.takeScreenshot).toHaveBeenCalled();
});

it("stores the screenshot on disk if a 'filePath' is configured", async () => {
  const filePath = "some/path";

  jest.spyOn(appiumService, "takeScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb());

  const buffer = await device.takeScreenshot({ filePath });

  expect(fs.writeFile).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
});