jest.mock("fs");
jest.mock("../../src/services/appiumService");

const fs = require("fs");
const { sessionStore } = require("../../src/stores/sessionStore");
const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  sessionStore.resetState();

  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a buffer containing the result of 'stopScreenRecording' on the Appium Service", async () => {
  const screenRecording = "dGVzdA==";

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockResolvedValue(screenRecording);

  const result = await device.stopScreenRecording();

  expect(result).toBeInstanceOf(Buffer);
  expect(result.toString("base64")).toEqual(screenRecording);
  expect(appiumService.stopScreenRecording).toHaveBeenCalled();
});

it("stores the screen recording on disk if a 'filePath' is configured", async () => {
  const filePath = "some/path";

  sessionStore.setState({ screenRecording: { filePath } });
  jest.spyOn(appiumService, "stopScreenRecording").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb());

  const buffer = await device.stopScreenRecording({ filePath });

  expect(fs.writeFile).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
});

it("resets the screen recording state on success", async () => {
  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockResolvedValue("dGVzdA==");

  await device.stopScreenRecording();

  expect(sessionStore.getScreenRecording()).toBeNull();
});

it("resets the screen recording state on error", async () => {
  const error = new AppiumError("Request error.", 3);

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockRejectedValue(error);

  await expect(device.stopScreenRecording())
    .rejects.toThrow(Error);

  expect(sessionStore.getScreenRecording()).toBeNull();
});

it("throws an ActionError if there isn't a recording in progress", async () => {
  sessionStore.setState({ screenRecording: null });
  jest.spyOn(appiumService, "stopScreenRecording").mockResolvedValue(null);
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (error) {
    expect(error).toBeInstanceOf(ActionError);
    expect(error).toHaveProperty("message", "No screen recording in progress to stop.");
  }

  expect(appiumService.stopScreenRecording).not.toHaveBeenCalled();
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (error) {
    expect(error).toBeInstanceOf(ActionError);
    expect(error).toHaveProperty("message", "Failed to stop screen recording.");
  }

  expect(appiumService.stopScreenRecording).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockRejectedValue(error);

  await expect(device.stopScreenRecording())
    .rejects.toThrow(error);

  expect(appiumService.stopScreenRecording).toHaveBeenCalled();
});