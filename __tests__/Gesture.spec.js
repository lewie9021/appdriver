const Gesture = require("../src/Gesture");

describe("press", () => {
  it("adds a press action to the sequence", () => {
    const gesture = new Gesture();

    gesture.press();

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerDown", button: 0}
      ]
    });
  });

  it("allows function chaining", () => {
    const gesture = new Gesture();

    const result = gesture.press();

    expect(result).toBeInstanceOf(Gesture);
  });

  it("supports passing x and y options", () => {
    const gesture = new Gesture();

    gesture.press({x: 100, y: 100});

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100},
        {type: "pointerDown", button: 0}
      ]
    });
  });
});

describe("wait", () => {
  it("adds a wait action to the sequence", () => {
    const gesture = new Gesture();

    gesture.wait({duration: 100});

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pause", duration: 100}
      ]
    });
  });

  it("allows function chaining", () => {
    const gesture = new Gesture();

    const result = gesture.wait({x: 100, y: 100});

    expect(result).toBeInstanceOf(Gesture);
  });
});

describe("moveTo", () => {
  it("adds a move action to the sequence", () => {
    const gesture = new Gesture();

    gesture.moveTo({x: 100, y: 100});

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 100, y: 100}
      ]
    });
  });

  it("allows function chaining", () => {
    const gesture = new Gesture();

    const result = gesture.moveTo({x: 100, y: 100});

    expect(result).toBeInstanceOf(Gesture);
  });
});