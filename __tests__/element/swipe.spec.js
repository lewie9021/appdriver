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

it("executes the 'swipeElement' method on the Appium Service", async () => {
  const ref = createFindElementMock();
  const distance = 100;
  const direction = 270;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipe({ distance, direction });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(
    expect.objectContaining({
      element: ref,
      distance,
      direction
    })
  );
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  const $element = await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });

  expect($element).toBeInstanceOf(Element);
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ x: 0, y: 0 }));
});

it("defaults the 'duration' parameter to 50", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ duration: 50 }));
});

it("supports passing 'x' and 'y' parameters to offset from the top left of the element", async () => {
  const ref = createFindElementMock();
  const x = 100;
  const y = 300;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipe({ x, y, distance: 100, direction: 270 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ x, y }));
});

it("supports passing a 'duration' parameter to redefine the swipe duration", async () => {
  const ref = createFindElementMock();
  const duration = 1000;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipe({ duration, distance: 100, direction: 270 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ duration }));
});

it("throws an ElementNotFoundError if the element isn't found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "list-item".`);
  }

  expect(appiumService.findElement).toHaveBeenCalled();
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to swipe on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "typeElementText").mockRejectedValue(error);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .swipe({ distance: 100, direction: 270 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.typeElementText).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("list-item")).swipe({ distance: 100, direction: 270 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
});
