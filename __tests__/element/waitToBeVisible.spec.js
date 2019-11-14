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

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);

  const $element = await element(by.label("input")).waitToBeVisible();

  expect($element).toBeInstanceOf(Element);
});

it("polls element visibility status until it resolves when there's an element reference", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToBeVisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(3);
});

it("polls 'conditionFn' until it resolves when there isn't an element reference", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);

  await element(by.label("input")).waitToBeVisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(4);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(3);
});

it.todo("forwards the new element value once resolved when there isn't an element reference");

it("throws an ElementWaitError if the polling times out", async () => {
  jest.setTimeout(6000);

  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToBeVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not visible after 5000ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToBeVisible({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not visible after ${maxDuration}ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  jest.setTimeout(6000);

  const interval = 50;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

  try {
    await element(by.label("input")).waitToBeVisible({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element not visible after 5000ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitToBeVisible();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(0);
});