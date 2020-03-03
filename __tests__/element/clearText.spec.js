jest.mock("../../src/worker/stores/sessionStore");
jest.mock("../../src/worker/services/appiumService");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'clearElementText' method on the Appium Service", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "clearElementText").mockResolvedValue(null);

  await element(by.label("input")).clearText();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "clearElementText").mockResolvedValue(null);

  const $element = await element(by.label("input")).clearText();

  expect($element).toBeInstanceOf(Element);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "clearElementText").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("input")).clearText();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "input".`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError if the hardware keyboard is attached on iOS simulator", async () => {
  setPlatform("iOS");

  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 12);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "clearElementText").mockRejectedValue(error);
  expect.assertions(5);

  try {
    await element(by.label("input")).clearText();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty(
      "message",
      "Failed to clear text on element. Make sure hardware keyboard is disconnected from iOS simulator."
    );
  }

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(1);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "clearElementText").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).clearText();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to clear text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "sendElementKeys").mockRejectedValue(error);
  jest.spyOn(appiumService, "clearElementText").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .clearText();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.sendElementKeys).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "clearElementText").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).clearText();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.clearElementText).toHaveBeenCalledTimes(1);
});
