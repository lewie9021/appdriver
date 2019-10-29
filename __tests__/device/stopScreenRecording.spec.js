const fs = require("fs");
const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");

beforeEach(() => {
  device._screenRecording = { filePath: "some/path" };
});

afterEach(() => {
  appiumServer.resetMocks();
  jest.restoreAllMocks();
  device._screenRecording = null;
});

it("stops recording the screen", async () => {
  const stopRecordingScreenMock = appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb());

  await device.stopScreenRecording();

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(1);
  expect(writeFileSpy).toHaveBeenCalledWith("some/path", expect.any(Buffer), expect.any(Function));
  expect(device._screenRecording).toBeNull();
});

it("throws if no screen recording is in progress", async () => {
  const stopRecordingScreenMock = appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });
  device._screenRecording = null;

  await expect(device.stopScreenRecording())
    .rejects.toThrow(new Error("No screen recording in progress to stop."));

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(0);
});

it("correctly handles stop recording screen request errors", async () => {
  const stopRecordingScreenMock = appiumServer.mockStopRecordingScreen({ status: 3 });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb());

  await expect(device.stopScreenRecording())
    .rejects.toThrow(new Error("Failed to stop screen recording."));

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(1);
  expect(writeFileSpy).not.toHaveBeenCalled();
});

it("correct handles file system errors", async () => {
  const stopRecordingScreenMock = appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb(new Error("File System error.")));

  await expect(device.stopScreenRecording())
    .rejects.toThrow(new Error("File System error."));

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(1);
  expect(writeFileSpy).toHaveBeenCalled();
});