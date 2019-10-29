const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
  device._screenRecording = null;
});

it("starts recording the screen", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

  await device.startScreenRecording({ filePath: "some/path" });

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(1);
  expect(device._screenRecording).not.toBeNull();
});

it("default the 'maxDuration' parameter to 180", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

  await device.startScreenRecording({ filePath: "some/path" });

  const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

  expect(startRecordingScreenMockCalls[0].options.body).toEqual({
    options: expect.objectContaining({
      timeLimit: 180
    })
  });
});

it("supports passing a 'maxDuration' parameter ", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

  await device.startScreenRecording({ filePath: "some/path", maxDuration: 30 });

  const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

  expect(startRecordingScreenMockCalls[0].options.body).toEqual({
    options: expect.objectContaining({
      timeLimit: 30
    })
  });
});

it("throws if there's already a recording in progress", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();
  device._screenRecording = { filePath: "some/other/path" };

  await expect(device.startScreenRecording({ filePath: "some/path" }))
    .rejects.toThrow(new Error("Screen recording already in progress."));

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(0);
});

it("throws if no 'filePath' parameter is passed", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

  await expect(device.startScreenRecording({}))
    .rejects.toThrow(new Error("You must pass a 'filePath' parameter."));

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(0);
});

it("correctly handles start recording screen request errors", async () => {
  const startRecordingScreenMock = appiumServer.mockStartRecordingScreen({ status: 3 });

  await expect(device.startScreenRecording({ filePath: "some/path" }))
    .rejects.toThrow(new Error("Failed to start screen recording."));

  expect(appiumServer.getCalls(startRecordingScreenMock)).toHaveLength(1);
});

describe("iOS", () => {
  it("defaults the 'format' parameter to 'mpeg4'", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

    await device.startScreenRecording({ filePath: "some/path" });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoType: "mpeg4"
      })
    });
  });

  it("supports passing a 'format' parameter", async () => {
    const startRecordingScreenMock = appiumServer.mockStartRecordingScreen();

    await device.startScreenRecording({ filePath: "some/path", format: "mp4" });

    const startRecordingScreenMockCalls = appiumServer.getCalls(startRecordingScreenMock);

    expect(startRecordingScreenMockCalls[0].options.body).toEqual({
      options: expect.objectContaining({
        videoType: "mp4"
      })
    });
  });
});