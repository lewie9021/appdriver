jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/worker/errors");
const { Element } = require("../../src/worker/Element");
const { element, by } = require("../../");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'swipeElement' method on the Appium Service", async () => {
  const ref = createFindElementMock();
  const distance = 100;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipeDown({ distance });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(
    expect.objectContaining({
      element: ref,
      distance,
      direction: 180
    })
  );
});

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  const $element = await element(by.label("list-item")).swipeDown({ distance: 100 });

  expect($element).toBeInstanceOf(Element);
});

it("defaults 'x' and 'y' parameters to 0", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipeDown({ distance: 100 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ x: 0, y: 0 }));
});

it("defaults the 'duration' parameter to 50", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipeDown({ distance: 100 });

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

  await element(by.label("list-item")).swipeDown({ x, y, distance: 100 });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(expect.objectContaining({ x, y }));
});

it("support passing a 'percentage' parameter to calculate the swipe distance", async () => {
  const ref = createFindElementMock();
  const size = { width: 200, height: 64 };
  const percentage = 0.75;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementSize").mockResolvedValue(size);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipeDown({ percentage });

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.getElementSize).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledWith(
    expect.objectContaining({
      distance: size.height * percentage
    })
  );
});

it("supports passing a 'duration' parameter to redefine the swipe duration", async () => {
  const ref = createFindElementMock();
  const duration = 1000;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);

  await element(by.label("list-item")).swipeDown({ duration, distance: 100 });

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
    await element(by.label("list-item")).swipeDown({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "list-item".`);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(0);
});

it("throws an ElementActionError for Appium request errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("list-item")).swipeDown({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to swipe down on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
});

it("propagates errors from further up the chain", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "sendElementKeys").mockRejectedValue(error);
  jest.spyOn(appiumService, "swipeElement").mockResolvedValue(null);
  expect.assertions(5);

  try {
    await element(by.label("input"))
      .typeText("Hello world!")
      .swipeDown({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to type text on element.");
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.sendElementKeys).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const ref = createFindElementMock();
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "swipeElement").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await element(by.label("list-item")).swipeDown({ distance: 100 });
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.swipeElement).toHaveBeenCalledTimes(1);
});
