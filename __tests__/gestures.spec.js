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

    return expect(result.resolve()).resolves.toEqual([{
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

describe("swipe", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.swipe({ x: 150, y: 200, direction: 0, distance: 100 });

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a swipe gesture", () => {
    const result = gestures.swipe({x: 150, y: 200, direction: 0, distance: 100});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });

  it("correctly defines a swipe gesture with duration parameter", () => {
    const result = gestures.swipe({x: 150, y: 200, direction: 90, distance: 100, duration: 75});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 75, origin: "pointer", x: 100, y: 0},
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

    return expect(result.resolve()).resolves.toEqual([{
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

  it("correctly defines a swipe left gesture with duration parameter", () => {
    const result = gestures.swipeLeft({x: 150, y: 200, distance: 100, duration: 75});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 75, origin: "pointer", x: -100, y: 0},
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

    return expect(result.resolve()).resolves.toEqual([{
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

  it("correctly defines a swipe right gesture with duration parameter", () => {
    const result = gestures.swipeRight({x: 150, y: 200, distance: 100, duration: 75});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 75, origin: "pointer", x: 100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});

describe("swipeUp", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.swipeUp({x: 150, y: 200, distance: 100});

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a swipe up gesture", () => {
    const result = gestures.swipeUp({x: 150, y: 200, distance: 100});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });

  it("correctly defines a swipe up gesture with duration parameter", () => {
    const result = gestures.swipeUp({x: 150, y: 200, distance: 100, duration: 75});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 75, origin: "pointer", x: 0, y: -100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});

describe("swipeDown", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.swipeDown({x: 150, y: 200, distance: 100});

    expect(result).toBeInstanceOf(Gesture);
  });

  it("correctly defines a swipe up gesture", () => {
    const result = gestures.swipeDown({x: 150, y: 200, distance: 100});

    return expect(result.resolve()).resolves.toEqual([{
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

  it("correctly defines a swipe up gesture with duration parameter", () => {
    const result = gestures.swipeDown({x: 150, y: 200, distance: 100, duration: 75});

    return expect(result.resolve()).resolves.toEqual([{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 75, origin: "pointer", x: 0, y: 100},
        {type: "pointerUp", button: 0}
      ]
    }]);
  });
});