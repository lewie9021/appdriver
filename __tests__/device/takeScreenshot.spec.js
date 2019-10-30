const fs = require("fs");
const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");
const { NotImplementedError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
  jest.restoreAllMocks();
});

it("takes a screenshot and stores on disk at the given 'filePath' location", async () => {
  const encodedScreenshot = "c2NyZWVuc2hvdA==";
  const decodedScreenshot = Buffer.from(encodedScreenshot, "base64").toString();
  const filePath = "filePath";
  const writeFileSpy = jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb());

  const screenshotMock = appiumServer.mockScreenshot({ data: encodedScreenshot });

  await device.takeScreenshot({ filePath });

  expect(appiumServer.getCalls(screenshotMock)).toHaveLength(1);
  expect(writeFileSpy).toHaveBeenCalledWith(filePath, decodedScreenshot, expect.any(Function));
});

it("correctly handles screenshot request errors", async () => {
  const screenshotMock = appiumServer.mockScreenshot({status: 3});
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

// TODO: Until we figure out what makes the most sense.
// - Should we infer a directory?
// - Should we return the base64 string?
it("throws if no filePath is given", () => {
  return expect(device.takeScreenshot())
    .rejects.toThrow(NotImplementedError);
});