const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");
const mockSession = require("../helpers/mockSession");

afterEach(() => {
  appiumServer.resetMocks();
  device._screenRecording = null;
});

const defaultParameters = [
  {name: "maxDuration", key: "timeLimit", value: 180},
  {name: "format", key: "videoType", value: "mpeg4"},
  {name: "quality", key: "videoQuality", value: "medium"},
  {name: "fps", key: "videoFps", value: 10}
];

it("starts recording the screen", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

  await device.startScreenRecording();

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(1);
  expect(device._screenRecording).not.toBeNull();
});

defaultParameters.forEach(({ name, key, value }) => {
  it(`defaults the '${name}' parameter to ${JSON.stringify(value)}`, async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

    await device.startScreenRecording();

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        [key]: value
      })
    });
  });
});

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

it("throws if there's already a recording in progress", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
  device._screenRecording = { filePath: "some/other/path" };

  await expect(device.startScreenRecording())
    .rejects.toThrow(new Error("Screen recording already in progress."));

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(0);
});

it("correctly handles start recording screen request errors", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen({ status: 3 });

  await expect(device.startScreenRecording({ filePath: "some/path" }))
    .rejects.toThrow(new Error("Failed to start screen recording."));

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(1);
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

  it("supports passing 'width' and 'height' parameters", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
    const width = 640;
    const height = 480;

    await device.startScreenRecording({ width, height });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoSize: `${width}x${height}`
      })
    });
  });

  it("throws if 'width' and 'height' aren't passed together", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

    await expect(device.startScreenRecording({ width: 640 }))
      .rejects.toThrow(new Error("You must provide a 'height' when passing a 'width'."));

    await expect(device.startScreenRecording({ height: 480 }))
      .rejects.toThrow(new Error("You must provide a 'width' when passing a 'height'."));

    expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(0);
  });
});