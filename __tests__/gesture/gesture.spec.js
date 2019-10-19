const Gesture = require("../../src/Gesture");

describe("Common Gestures", () => {
  it("correctly defines a tap gesture", () => {
    const tap = new Gesture()
      .press({x: 0, y: 0})
      .wait({duration: 100})
      .release();

    return expect(tap.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 100},
        {type: "pointerUp", button: 0}
      ]
    }])
  });

  it("correctly defines a long press gesture", () => {
    const longPress = new Gesture()
      .press({x: 0, y: 0})
      .wait({duration: 1000})
      .release();

    return expect(longPress.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 1000},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });

  it("correctly defines a swipe left gesture", () => {
    const swipeLeft = new Gesture()
      .press({x: 150, y: 200})
      .wait({duration: 250})
      .moveTo({x: -100, y: 0, relative: true, duration: 50})
      .release();

    return expect(swipeLeft.resolve()).resolves.toEqual([{
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

  it("correctly defines a swipe right gesture", () => {
    const swipeRight = new Gesture()
      .press({x: 150, y: 200})
      .wait({duration: 250})
      .moveTo({x: 100, y: 0, relative: true, duration: 50})
      .release();

    return expect(swipeRight.resolve()).resolves.toEqual([{
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

  it("correctly defines a swipe up gesture", () => {
    const swipeUp = new Gesture()
      .press({x: 150, y: 300})
      .wait({duration: 250})
      .moveTo({x: 0, y: -100, relative: true, duration: 50})
      .release();

    return expect(swipeUp.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 300},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });

  it("correctly defines a swipe down gesture", () => {
    const swipeDown = new Gesture()
      .press({x: 150, y: 200})
      .wait({duration: 250})
      .moveTo({x: 0, y: 100, relative: true, duration: 50})
      .release();

    return expect(swipeDown.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});