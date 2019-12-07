jest.mock("fs");
jest.mock("../../src/worker/services/appiumService");

const fs = require("fs");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { AppiumError, ElementNotFoundError, ElementActionError } = require("../../src/worker/errors");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns a buffer containing the result of 'takeScreenshot' on the Appium Service", async () => {
  const ref = createFindElementMock();
  const screenshot = "dGVzdA==";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "takeElementScreenshot").mockResolvedValue(screenshot);

  const result = await element(by.label("list-item")).takeScreenshot();

  expect(result).toBeInstanceOf(Buffer);
  expect(result.toString("base64")).toEqual(screenshot);
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(1);
});

it("stores the screenshot on disk if a 'filePath' is configured", async () => {
  const ref = createFindElementMock();
  const filePath = "some/path";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "takeElementScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb());

  const buffer = await element(by.label("list-item")).takeScreenshot({ filePath });

  expect(fs.writeFile).toHaveBeenCalledWith(filePath, buffer, expect.any(Function));
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "takeElementScreenshot").mockResolvedValue("dGVzdA==");
  expect.assertions(4);

  try {
    await element(by.label("list-item")).takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", "Failed to find element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "takeElementScreenshot").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await element(by.label("list-item")).takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to take element screenshot.");
  }

  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(1);
});

it("throws an ElementActionError if it is unable to store on disk when a 'filePath' is configured", async () => {
  const ref = createFindElementMock();
  const error = new Error("File system error.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "takeElementScreenshot").mockResolvedValue("dGVzdA==");
  jest.spyOn(fs, "writeFile").mockImplementation((path, data, cb) => cb(error));
  expect.assertions(4);

  try {
    await element(by.label("list-item")).takeScreenshot({ filePath: "some/path" });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to store element screenshot on disk.");
  }

  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(1);
  expect(fs.writeFile).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "takeElementScreenshot").mockResolvedValue("dGVzdA==");
  expect.assertions(5);

  try {
    await element(by.label("list-item"))
      .tap()
      .takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "takeElementScreenshot").mockRejectedValue(error);
  expect.assertions(3);

  try {
    await element(by.label("list-item")).takeScreenshot();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.takeElementScreenshot).toHaveBeenCalledTimes(1);
});