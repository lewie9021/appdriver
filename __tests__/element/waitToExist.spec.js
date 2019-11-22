jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, ElementWaitError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(true);

  const $element = await element(by.label("input")).waitToExist();

  expect($element).toBeInstanceOf(Element);
});

it("polls element existence status until it resolves when there's an element reference", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToExist();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(3);
});

it("polls element existence status until it resolves when there isn't an element reference", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToExist();

  expect(appiumService.findElement).toHaveBeenCalledTimes(4);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(3);
});

it.todo("forwards the new element value once resolved when there isn't an element reference");

it("throws an ElementWaitError if the polling times out", async () => {
  jest.setTimeout(6000);

  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToExist();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not found after 5000ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToExist({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not found after ${maxDuration}ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  jest.setTimeout(6000);

  const interval = 50;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToExist({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not found after 5000ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitToExist();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementExists).toHaveBeenCalledTimes(0);
});