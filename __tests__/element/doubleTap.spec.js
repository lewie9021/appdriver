jest.mock("../../src/stores/configStore");
jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform, setConfig } = require("../helpers");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../main");

beforeEach(() => {
  setPlatform("iOS");
  setConfig({ findInterval: 200, findTimeout: 1000 });
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'doubleTapElement' method on the Appium Service", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);

  await element(by.label("button")).doubleTap();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);

  const $element = await element(by.label("button")).doubleTap();

  expect($element).toBeInstanceOf(Element);
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);

  await element(by.label("button")).doubleTap();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledWith({ element: ref, x: 0, y: 0 });
});

// TODO: Not sure if this is really just a false positive.
it.skip("returns a new element to avoid unwanted mutation", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);

  const $element = await element(by.label("button"));
  const $newElement = await $element.doubleTap();

  expect($newElement).not.toBe($element);
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
});

it("supports passing 'x' and 'y' parameters to offset from the top left of the element", async () => {
  const ref = createFindElementMock();
  const x = 100;
  const y = 300;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);

  await element(by.label("button")).doubleTap({ x, y });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledWith({ element: ref, x, y });
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("box")).doubleTap();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "box".`);
  }

  expect(appiumService.findElement).toHaveBeenCalled();
  expect(appiumService.doubleTapElement).not.toHaveBeenCalled();
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).doubleTap();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to double tap element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "typeElementText").mockRejectedValue(error);
  jest.spyOn(appiumService, "doubleTapElement").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .doubleTap();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.typeElementText).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "doubleTapElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("box")).doubleTap();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.doubleTapElement).toHaveBeenCalledTimes(1);
});
