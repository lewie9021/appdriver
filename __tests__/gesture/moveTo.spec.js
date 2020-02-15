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

it("adds a move action to the sequence", () => {
  const gesture = new Gesture();

  gesture.moveTo({ x: 100, y: 100 });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100 }
    ]
  }]);
});

it("allows function chaining", () => {
  const gesture = new Gesture();

  const result = gesture.moveTo({x: 100, y: 100});

  expect(result).toBeInstanceOf(Gesture);
});

it("supports moving to a relative coordinate", () => {
  const gesture = new Gesture();

  gesture.moveTo({ x: 100, y: 100, relative: true });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100 }
    ]
  }]);
});

it("supports defining a duration", () => {
  const gesture = new Gesture();

  gesture.moveTo({ x: 100, y: 100, duration: 75 });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 75, origin: "viewport", x: 100, y: 100 }
    ]
  }]);
});

it("supports moving to a coordinate relative to the given element", () => {
  const ref = createFindElementMock();
  const location = { x: 100, y: 400 };
  const x = 50;
  const y = 32;

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementLocation").mockResolvedValue(location);

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.moveTo({ x, y, duration: 75, element: $element });

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      { type: "pointerMove", duration: 75, origin: "viewport", x: location.x + x, y: location.y + y }
    ]
  }]);
});

it("throws if the element is not found", async () => {
  const error = new AppiumError("Request error.", 7);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.moveTo({ x: 100, y: 32, duration: 75, element: $element });
  expect.assertions(2);

  try {
    await gesture.resolve();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find element by label matching "button".`);
  }
});