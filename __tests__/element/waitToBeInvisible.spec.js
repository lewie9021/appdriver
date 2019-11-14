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
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);

  const $element = await element(by.label("input")).waitToBeInvisible();

  expect($element).toBeInstanceOf(Element);
});

it("polls element visibility status until it resolves when there's an element reference", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);

  await element(by.label("input")).waitToBeInvisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(3);
});

it("polls element visibility status until it resolves when there isn't an element reference", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockRejectedValueOnce(error);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(true);
  jest.spyOn(appiumService, "findElement").mockResolvedValueOnce(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValueOnce(false);

  await element(by.label("input")).waitToBeInvisible();

  expect(appiumService.findElement).toHaveBeenCalledTimes(4);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(3);
});

it("throws an ElementWaitError if the polling times out", async () => {
  jest.setTimeout(6000);

  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);

  try {
    await element(by.label("input")).waitToBeInvisible();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element still visible after 5000ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);

  try {
    await element(by.label("input")).waitToBeInvisible({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element still visible after ${maxDuration}ms timeout (interval: 200ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("supports passing a 'interval' parameter", async () => {
  jest.setTimeout(6000);

  const interval = 50;
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(true);

  try {
    await element(by.label("input")).waitToBeInvisible({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementWaitError);
    expect(err).toHaveProperty("message", `Element still visible after 5000ms timeout (interval: ${interval}ms).`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const tapError = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockRejectedValue(tapError);
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .tap()
      .waitToBeInvisible();
  } catch (error) {
    expect(error).toBeInstanceOf(ElementActionError);
    expect(error).toHaveProperty("message", "Failed to tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementVisibleAttribute).toHaveBeenCalledTimes(0);
});