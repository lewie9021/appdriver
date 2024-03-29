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

it("executes the 'tapElementReturnKey' method on the Appium Service", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElementReturnKey").mockResolvedValue(null);

  await element(by.label("input")).tapReturnKey();

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledWith(expect.objectContaining({ element: ref }));
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElementReturnKey").mockResolvedValue(null);

  const $element = await element(by.label("input")).tapReturnKey();

  expect($element).toBeInstanceOf(Element);
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "tapElementReturnKey").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("input")).tapReturnKey();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "input".`);
  }

  expect(appiumService.findElement).toHaveBeenCalled();
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElementReturnKey").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).tapReturnKey();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to tap return key on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "typeElementText").mockRejectedValue(error);
  jest.spyOn(appiumService, "tapElementReturnKey").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .tapReturnKey();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.typeElementText).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElementReturnKey").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("input")).tapReturnKey();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElementReturnKey).toHaveBeenCalledTimes(1);
});
