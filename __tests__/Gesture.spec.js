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

  it("supports passing relative x and y coordinates", () => {
    const gesture = new Gesture();

    gesture.press({relative: true, x: 100, y: 100});

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100},
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

  it("supports moving to a relative coordinate", () => {
    const gesture = new Gesture();

    gesture.moveTo({x: 100, y: 100, relative: true});

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "pointer", x: 100, y: 100}
      ]
    });
  });
});

describe("release", () => {
  it("adds a release action to the sequence", () => {
    const gesture = new Gesture();

    gesture.release();

    expect(gesture._getActions()).toEqual({
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerUp", button: 0}
      ]
    });
  });

  it("allows function chaining", () => {
    const gesture = new Gesture();

    const result = gesture.release();

    expect(result).toBeInstanceOf(Gesture);
  });
});

describe("Common Gestures", () => {
  it("correctly defines a tap gesture", () => {
    const tap = new Gesture()
      .press({x: 0, y: 0})
      .wait({duration: 100})
      .release();

    expect(tap._getActions()).toEqual({
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
    })
  });

  it("correctly defines a long press gesture", () => {
    const longPress = new Gesture()
      .press({x: 0, y: 0})
      .wait({duration: 1000})
      .release();

    expect(longPress._getActions()).toEqual({
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
    });
  });

  it("correctly defines a swipe left gesture", () => {
    const longPress = new Gesture()
      .press({x: 150, y: 200})
      .wait({duration: 250})
      .moveTo({x: -100, y: 0, relative: true, duration: 50})
      .release();

    expect(longPress._getActions()).toEqual({
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
    });
  });

  it("correctly defines a swipe right gesture", () => {
    const longPress = new Gesture()
      .press({x: 150, y: 200})
      .wait({duration: 250})
      .moveTo({x: 100, y: 0, relative: true, duration: 50})
      .release();

    expect(longPress._getActions()).toEqual({
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
    });
  });
});