jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { configStore } = require("../../src/stores/configStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementActionError, ElementWaitError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(true);

  const $element = await element(by.label("input")).waitToBeFocused();

  expect($element).toBeInstanceOf(Element);
});

it("polls element focused status until it resolves when there's an element reference", async () => {
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToBeFocused();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementFocusedAttribute).toHaveBeenCalledTimes(3);
});

it("polls element focused status until it resolves when there isn't an element reference", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToBeFocused();

  expect(appiumService.findElement).toHaveBeenCalledTimes(4);
  expect(appiumService.getElementFocusedAttribute).toHaveBeenCalledTimes(3);
});

it("throws an ElementWaitError if the polling times out", async () => {
  const ref = createFindElementMock();
  const timeout = 2000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeFocused();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element not focused after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const ref = createFindElementMock();
  const maxDuration = 1000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeFocused({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element not focused after ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  const ref = createFindElementMock();
  const timeout = 2000;
  const interval = 100;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeFocused({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element not focused after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementFocusedAttribute").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitToBeFocused();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementFocusedAttribute).toHaveBeenCalledTimes(0);
});