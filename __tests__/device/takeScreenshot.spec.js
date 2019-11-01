const fs = require("fs");
const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
  jest.restoreAllMocks();
});

it("takes a screenshot and stores on disk at the given 'filePath' location", async () => {
  const screenshotMock = appiumServer.mockScreenshot({ data: "dGVzdA==" });

  await device.takeScreenshot();

  expect(appiumServer.getCalls(screenshotMock)).toHaveLength(1);
});

it("returns a buffer containing the base64 encoding of the video", async () => {
  appiumServer.mockScreenshot({ data: "dGVzdA==" });

  const buffer = await device.takeScreenshot();

  expect(buffer).toBeInstanceOf(Buffer);
});

it("stores on disk if a 'filePath' is configured", async () => {
  const filePath = "some/path";

  appiumServer.mockScreenshot({ data: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb());

  const buffer = await device.takeScreenshot({ filePath });

  expect(writeFileSpy).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
});

it("correctly handles screenshot request errors", async () => {
  const screenshotMock = appiumServer.mockScreenshot({ status: 3 });
  const filePath = "filePath";

  await expect(device.takeScreenshot({ filePath }))
    .rejects.toThrow(new Error("Failed to take screenshot."));

  expect(appiumServer.getCalls(screenshotMock)).toHaveLength(1);
});

it("correct handles file system errors", async () => {
  const screenshotMock = appiumServer.mockScreenshot({ data: "dGVzdA==" });
  const writeFileSpy = jest.spyOn(fs, "writeFile")
    .mockImplementation((path, data, cb) => cb(new Error("File System error.")));

  await expect(device.takeScreenshot({ filePath: "some/path" }))
    .rejects.toThrow(new Error("File System error."));

  expect(appiumServer.getCalls(screenshotMock)).toHaveLength(1);
  expect(writeFileSpy).toHaveBeenCalled();
});