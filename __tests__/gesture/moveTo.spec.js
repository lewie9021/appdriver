jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const Gesture = require("../../src/Gesture");
const { createElementFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

it("adds a move action to the sequence", () => {
  const gesture = new Gesture();

  gesture.moveTo({x: 100, y: 100});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100}
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

  gesture.moveTo({x: 100, y: 100, relative: true});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100}
    ]
  }]);
});

it("supports defining a duration", () => {
  const gesture = new Gesture();

  gesture.moveTo({x: 100, y: 100, duration: 75});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 75, origin: "viewport", x: 100, y: 100}
    ]
  }]);
});

it("supports moving to a coordinate relative to the given element", () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));

  const gesture = new Gesture();
  const $element = element(by.label("button"));

  gesture.moveTo({x: 100, y: 32, duration: 75, element: $element});

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 75, origin: {element: "elementId"}, x: 100, y: 32}
    ]
  }]);
});