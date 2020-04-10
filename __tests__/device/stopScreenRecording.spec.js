jest.mock("fs");
jest.mock("../../src/worker/services/appiumService");

const fs = require("fs");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../main");

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
  expect(appiumService.stopScreenRecording).toHaveBeenCalledTimes(1);
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
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to stop screen recording.");
  }

  expect(sessionStore.getScreenRecording()).toBeNull();
});

it("throws an ActionError if there isn't a recording in progress", async () => {
  sessionStore.setState({ screenRecording: null });
  jest.spyOn(appiumService, "stopScreenRecording").mockResolvedValue(null);
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "No screen recording in progress to stop.");
  }

  expect(appiumService.stopScreenRecording).not.toHaveBeenCalledTimes(1);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to stop screen recording.");
  }

  expect(appiumService.stopScreenRecording).toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  sessionStore.setState({ screenRecording: { filePath: null } });
  jest.spyOn(appiumService, "stopScreenRecording").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await device.stopScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.stopScreenRecording).toHaveBeenCalledTimes(1);
});