jest.mock("../../src/stores/sessionStore");
jest.mock("../../src/services/appiumService");

const { sessionStore } = require("../../src/stores/sessionStore");
const { appiumService } = require("../../src/services/appiumService");
const { AppiumError, ActionError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const defaultParameters = [
  {name: "forceRestart", key: "forceRestart", value: false},
  {name: "maxDuration", key: "timeLimit", value: 180},
  {name: "format", key: "videoType", value: "mpeg4"},
  {name: "quality", key: "videoQuality", value: "medium"},
  {name: "fps", key: "videoFps", value: 10}
];

it("executes the 'startScreenRecording' method on the Appium Service", async () => {
  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

  await device.startScreenRecording();

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalled();
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

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockRejectedValue(error);

  await expect(device.startScreenRecording())
    .rejects.toThrow(new ActionError("Failed to start screen recording."));

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalled();
});

it("throws an ActionError if there's already a recording in progress", async () => {
  jest.spyOn(sessionStore, "getScreenRecording").mockReturnValue({ filePath: null });
  jest.spyOn(appiumService, "startScreenRecording").mockResolvedValue(null);

  await expect(device.startScreenRecording())
    .rejects.toThrow(new ActionError("Screen recording already in progress."));

  expect(sessionStore.getScreenRecording).toHaveBeenCalled();
  expect(appiumService.startScreenRecording).not.toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  jest.spyOn(appiumService, "startScreenRecording").mockRejectedValue(error);

  await expect(device.startScreenRecording())
    .rejects.toThrow(error);

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.startScreenRecording).toHaveBeenCalled();
});

/*
it("supports passing a 'maxDuration' parameter ", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
  const maxDuration = 30;

  await device.startScreenRecording({ maxDuration });

  const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

  expect(startRecordingScreenMockCalls[0].options.body).toEqual({
    options: expect.objectContaining({
      timeLimit: maxDuration
    })
  });
});

it("supports passing a 'forceRestart' parameter ", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
  const forceRestart = true;

  await device.startScreenRecording({ forceRestart });

  const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

  expect(startRecordingScreenMockCalls[0].options.body).toEqual({
    options: expect.objectContaining({
      forceRestart
    })
  });
});

describe("iOS", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });
  });

  it("supports passing a 'format' parameter", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
    const format = "mp4";

    await device.startScreenRecording({ format });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoType: format
      })
    });
  });

  it("supports passing a 'quality' parameter", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
    const quality = "high";

    await device.startScreenRecording({ quality });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoQuality: quality
      })
    });
  });

  it("supports passing a 'fps' parameter", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
    const fps = 30;

    await device.startScreenRecording({ fps });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoFps: fps
      })
    });
  });
});

describe("Android", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "Android"
    });
  });

  it("supports passing a 'size' parameter", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
    const size = { width: 640, height: 480 };

    await device.startScreenRecording({ size });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoSize: `${size.width}x${size.height}`
      })
    });
  });

  it("throws if 'size.width' and 'size.height' aren't passed together", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

    await expect(device.startScreenRecording({ size: { } }))
      .rejects.toThrow(new Error("You must provide a 'size.width' and 'size.height' when passing a 'size'."));

    await expect(device.startScreenRecording({ size: { width: 640 } }))
      .rejects.toThrow(new Error("You must provide a 'size.height' when passing a 'size.width'."));

    await expect(device.startScreenRecording({ size: { height: 480 } }))
      .rejects.toThrow(new Error("You must provide a 'size.width' when passing a 'size.height'."));

    expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(0);
  });
});
 */