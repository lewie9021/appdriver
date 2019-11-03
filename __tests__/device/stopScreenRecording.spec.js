const fs = require("fs");
const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");

beforeEach(() => {
  device._screenRecording = { filePath: null };
});

afterEach(() => {
  appiumServer.resetMocks();
  jest.restoreAllMocks();
  device._screenRecording = null;
});

it("stops recording the screen", async () => {
  const stopRecordingScreenMock = appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });

  await device.stopScreenRecording();

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(1);
  expect(device._screenRecording).toBeNull();
});

it("returns a buffer containing the base64 encoding of the video", async () => {
  appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });

  const buffer = await device.stopScreenRecording();

  expect(buffer).toBeInstanceOf(Buffer);
});

it("stores on disk if a 'filePath' is configured", async () => {
  const filePath = "some/path";

  appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb());

  device._screenRecording = { filePath };

  const buffer = await device.stopScreenRecording();

  expect(writeFileSpy).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
  expect(device._screenRecording).toBeNull();
});

it("doesn't doesn't store on disk if a 'filePath' isn't configured", async () => {
  appiumServer.mockStopRecordingScreen({ value: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb());

  device._screenRecording = { filePath: null };

  await device.stopScreenRecording();

  expect(writeFileSpy).not.toHaveBeenCalled();
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

  device._screenRecording = { filePath: "some/path" };

  await expect(device.stopScreenRecording())
    .rejects.toThrow(new Error("File System error."));

  expect(appiumServer.getCalls(stopRecordingScreenMock)).toHaveLength(1);
  expect(writeFileSpy).toHaveBeenCalled();
});