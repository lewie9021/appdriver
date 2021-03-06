jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform, setConfig } = require("../helpers");
const { ElementActionError, ElementWaitError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: 50, waitTimeout: 2000 });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

  const $element = await element(by.label("input")).waitToBeInvisible();

  expect($element).toBeInstanceOf(Element);
});

it("polls element visibility status until it resolves when there's an element reference", async () => {
  const ref = createFindElementMock();

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: 50, waitTimeout: 2000 });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);

  await element(by.label("input")).waitToBeInvisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(3);
});

it("throws an ElementWaitError if the polling times out", async () => {
  const ref = createFindElementMock();
  const timeout = 2000;
  const interval = 50;

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: interval, waitTimeout: timeout });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeInvisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element still visible after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const ref = createFindElementMock();
  const maxDuration = 1000;
  const interval = 50;

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: interval, waitTimeout: 2000 });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeInvisible({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element still visible after ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  const ref = createFindElementMock();
  const timeout = 2000;
  const interval = 100;

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: 50, waitTimeout: timeout });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);
  expect.assertions(3);

  try {
    await element(by.label("input")).waitToBeInvisible({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty(
      "message",
      `Element still visible after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  setConfig({ findInterval: 200, findTimeout: 1000, waitInterval: 50, waitTimeout: 2000 });
  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitToBeInvisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(0);
});
