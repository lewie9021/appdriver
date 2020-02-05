jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { setPlatform } = require("../helpers");
const { AppiumError, ElementNotFoundError } = require("../../src/worker/errors");
const Gesture = require("../../src/worker/Gesture");
const { element, by } = require("../../");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("adds a press action to the sequence", () => {
  const gesture = new Gesture();

  gesture.press();

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerDown", button: 0 }
    ]
  }]);
});

it("allows function chaining", () => {
  const gesture = new Gesture();

  const result = gesture.press();

  expect(result).toBeInstanceOf(Gesture);
});

it("supports passing x and y options", () => {
  const gesture = new Gesture();

  gesture.press({ x: 100, y: 100 });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100 },
      { type: "pointerDown", button: 0 }
    ]
  }]);
});

it("supports passing relative x and y coordinates", () => {
  const gesture = new Gesture();

  gesture.press({relative: true, x: 100, y: 100});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100 },
      { type: "pointerDown", button: 0 }
    ]
  }]);
});

it("supports passing an element, making x and y coordinates relative to it", () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.press({ element: $element, x: 100, y: 100 });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 0, origin: { element: ref.ELEMENT }, x: 100, y: 100 },
      { type: "pointerDown", button: 0 }
    ]
  }]);
});

it("throws if the element is not found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.press({ element: $element, x: 100, y: 100 });
  expect.assertions(2);

  try {
    await gesture.resolve();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", "Failed to find element.");
  }
});