const Gesture = require("../../src/worker/Gesture-v2");
const gestures = require("../../src/worker/gestures-v2");

it("returns a Gesture instance", () => {
  const gesture = gestures.swipeDown({ x: 100, y: 100, distance: 200 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a swipe down gesture", () => {
  const x = 200;
  const y = 300;
  const distance = 100;
  const gesture = gestures.swipeDown({ x, y, distance });

  expect(gesture.resolve()).toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {
        type: "pointerMove",
        origin: "viewport",
        duration: 0,
        x,
        y
      },
      {
        type: "pointerDown",
        button: 0
      },
      {
        type: "pause",
        duration: 250
      },
      {
        type: "pointerMove",
        origin: "pointer",
        duration: 50,
        x: 0,
        y: distance
      },
      {
        type: "pointerUp",
        button: 0
      }
    ]
  }]);
});

it("supports passing a duration parameter", () => {
  const duration = 2000;
  const gesture = gestures.swipeDown({ x: 100, y: 100, distance: 200, duration });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove", duration }),
        expect.objectContaining({ type: "pointerUp" }),
      ]
    })
  ]);
});