jest.mock("../../src/worker/stores/sessionStore");
jest.mock("../../src/worker/services/appiumService");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setElementValue' method on the Appium Service", async () => {
  const ref = createFindElementMock();
  const value = "Hello world!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "setElementValue").mockResolvedValue(null);

  await element(by.label("input")).setValue(value);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledWith({ element: ref, value });
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "setElementValue").mockResolvedValue(null);

  const $element = await element(by.label("input")).setValue("Hello world!");

  expect($element).toBeInstanceOf(Element);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "setElementValue").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("input")).setValue("Hello world!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "input".`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError if the hardware keyboard is attached on iOS simulator", async () => {
  setPlatform("iOS");

  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 13);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "setElementValue").mockRejectedValue(error);
  expect.assertions(5);

  try {
    await element(by.label("input")).setValue("Hello world!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty(
      "message",
      "Failed to set value on element. Ensure hardware keyboard is disconnected from iOS simulator."
    );
  }

  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledTimes(1);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "setElementValue").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).setValue("Hello world!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to set value on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "setElementValue").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .setValue("Hello world!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "setElementValue").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).setValue("Hello World");
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.setElementValue).toHaveBeenCalledTimes(1);
});
