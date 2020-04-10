jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { configStore } = require("../../src/stores/configStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementActionError, ElementWaitError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const createConditionFn = (maxPollCount, error) => {
  let pollCount = 0;

  return jest.fn(() => {
    pollCount += 1;

    return pollCount >= maxPollCount
      ? Promise.resolve()
      : Promise.reject(error);
  });
};

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  const $element = await element(by.label("input")).waitFor(() => Promise.resolve());

  expect($element).toBeInstanceOf(Element);
});

it("polls 'conditionFn' until it resolves when there's an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("polls 'conditionFn' until it resolves when there isn't an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("throws an ElementWaitError if the polling times out", async () => {
  const conditionFn = createConditionFn(Infinity, new Error("Test"));
  const ref = createFindElementMock();
  const timeout = 2000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitFor(conditionFn);
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Wait condition exceeded ${timeout}ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const interval = 50;
  const conditionFn = createConditionFn(Infinity, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitFor(conditionFn, { maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  const interval = 100;
  const timeout = 2000;
  const conditionFn = createConditionFn(Infinity, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitFor(conditionFn, { interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Wait condition exceeded ${timeout}ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const conditionFn = createConditionFn(5, new Error("Test"));
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitFor(conditionFn);
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(0);
});
