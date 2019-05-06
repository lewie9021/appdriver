const Gesture = require("../src/Gesture");
const gestures = require("../src/gestures");

describe("create", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.create();

    expect(result).toBeInstanceOf(Gesture);
  });
});

describe("longPress", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.longPress({x: 150, y: 250});

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a longPress gesture", () => {
    const result = gestures.longPress({x: 150, y: 250});

    expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 250},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 750},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});

describe("swipeLeft", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.swipeLeft({x: 150, y: 200, distance: 100});

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a swipe left gesture", () => {
    const result = gestures.swipeLeft({x: 150, y: 200, distance: 100});

    expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: -100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});

describe("swipeRight", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.swipeRight({x: 150, y: 200, distance: 100});

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a swipe right gesture", () => {
    const result = gestures.swipeRight({x: 150, y: 200, distance: 100});

    expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});