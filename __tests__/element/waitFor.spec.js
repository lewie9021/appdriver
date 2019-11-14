jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, ElementWaitError, AppiumError } = require("../../src/errors");
const { Element } = require("../../src/Element");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const createConditionFn = (maxPollCount, error) => {
  let pollCount = 0;

  return jest.fn(() => {
    pollCount +=1;

    return pollCount >= maxPollCount
      ? Promise.resolve()
      : Promise.reject(error);
  });
};

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  const $element = await element(by.label("input")).waitFor(() => Promise.resolve());

  expect($element).toBeInstanceOf(Element);
});

it("polls 'conditionFn' until it resolves when there's an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("polls 'conditionFn' until it resolves when there isn't an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("throws an ElementWaitError if the polling times out", async () => {
  jest.setTimeout(6000);

  const totalPollCount = 100;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  try {
    await element(by.label("input")).waitFor(conditionFn);
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Wait condition exceeded 5000ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const totalPollCount = 100;
  const maxDuration = 1000;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  try {
    await element(by.label("input")).waitFor(conditionFn, { maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Wait condition exceeded ${maxDuration}ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  jest.setTimeout(6000);

  const totalPollCount = 100;
  const interval = 50;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  try {
    await element(by.label("input")).waitFor(conditionFn, { interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Wait condition exceeded 5000ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const conditionFn = createConditionFn(5, new Error("Test"));
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitFor(conditionFn);
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(0);
});