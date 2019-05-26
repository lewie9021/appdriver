const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const Gesture = require("../../src/Gesture");

afterEach(() => {
  appiumServer.resetMocks();
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
      {type: "pointerDown", button: 0}
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

  gesture.press({x: 100, y: 100});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100},
      {type: "pointerDown", button: 0}
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
      {type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100},
      {type: "pointerDown", button: 0}
    ]
  }]);
});

it("supports passing an element, making x and y coordinates relative to it", () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.press({element: $element, x: 100, y: 100});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: {element: "elementId"}, x: 100, y: 100},
      {type: "pointerDown", button: 0}
    ]
  }]);
});