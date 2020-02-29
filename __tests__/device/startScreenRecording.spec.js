jest.mock("../../src/worker/stores/sessionStore");
jest.mock("../../src/worker/services/appiumService");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const defaultParameters = [
  { name: "forceRestart", key: "forceRestart", value: false },
  { name: "maxDuration", key: "timeLimit", value: 180 },
  { name: "format", key: "videoType", value: "mpeg4" },
  { name: "quality", key: "videoQuality", value: "medium" },
  { name: "fps", key: "videoFps", value: 10 }
];

it("executes the 'startScreenRecording' method on the Appium Service", async () => {
  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

  await device.startScreenRecording();

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalledTimes(1);
  expect(sessionStore.setState).toHaveBeenCalledWith({ screenRecording: { filePath: null } });
});

defaultParameters.forEach(({ name, key, value }) => {
  it(`defaults '${name}' parameter to ${JSON.stringify(value)}`, async () => {
    jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

    await device.startScreenRecording();

    expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
    expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
      options: expect.objectContaining({ [key]: value })
    });
  });
});

it("supports passing a 'maxDuration' parameter ", async () => {
  const maxDuration = 30;

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

  await device.startScreenRecording({ maxDuration });

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
    options: expect.objectContaining({ timeLimit: maxDuration })
  });
});

it("supports passing a 'forceRestart' parameter", async () => {
  const forceRestart = true;

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

  await device.startScreenRecording({ forceRestart });

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
    options: expect.objectContaining({ forceRestart })
  });
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await device.startScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to start screen recording.");
  }

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalledTimes(1);
});

it("throws an ActionError if there's already a recording in progress", async () => {
  jest.spyOn(sessionStore, "getScreenRecording").mockReturnValue({ filePath: null });
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await device.startScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Screen recording already in progress.");
  }

  expect(sessionStore.getScreenRecording).toHaveBeenCalledTimes(1);
  expect(appiumService.startScreenRecording).not.toHaveBeenCalledTimes(1);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await device.startScreenRecording();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalledTimes(1);
});

describe("iOS", () => {
  beforeEach(() => {
    jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  });

  it("supports passing a 'format' parameter", async () => {
    const format = "mp4";

    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

    await device.startScreenRecording({ format });

    expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
    expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
      options: expect.objectContaining({ videoType: format })
    });
  });

  it("supports passing a 'quality' parameter", async () => {
    const quality = "high";

    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

    await device.startScreenRecording({ quality });

    expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
    expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
      options: expect.objectContaining({ videoQuality: quality })
    });
  });

  it("supports passing a 'fps' parameter", async () => {
    const fps = 30;

    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

    await device.startScreenRecording({ fps });

    expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
    expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
      options: expect.objectContaining({ videoFps: fps })
    });
  });
});

describe("Android", () => {
  beforeEach(() => {
    jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android");
  });

  it("supports passing a 'size' parameter", async () => {
    const size = { width: 640, height: 480 };

    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

    await device.startScreenRecording({ size });

    expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
    expect(appiumService.startScreenRecording).toHaveBeenCalledWith({
      options: expect.objectContaining({ videoSize: `${size.width}x${size.height}` })
    });
  });

  it("throws an ActionError if 'size.width' and 'size.height' aren't passed together", async () => {
    jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);
    expect.assertions(7);

    try {
      await device.startScreenRecording({ size: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(ActionError);
      expect(err).toHaveProperty("message", "You must provide a 'size.width' and 'size.height' when passing a 'size'.");
    }

    try {
      await device.startScreenRecording({ size: { width: 640 } });
    } catch (err) {
      expect(err).toBeInstanceOf(ActionError);
      expect(err).toHaveProperty("message", "You must provide a 'size.height' when passing a 'size.width'.");
    }

    try {
      await device.startScreenRecording({ size: { height: 480 } });
    } catch (err) {
      expect(err).toBeInstanceOf(ActionError);
      expect(err).toHaveProperty("message", "You must provide a 'size.width' when passing a 'size.height'.");
    }

    expect(appiumService.startScreenRecording).not.toHaveBeenCalledTimes(1);
  });
});