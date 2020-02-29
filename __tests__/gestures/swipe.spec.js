const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.swipe({ x: 100, y: 100, distance: 200, direction: 90 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a swipe gesture", () => {
  const x = 200;
  const y = 300;
  const distance = 100;
  const gesture = gestures.swipe({ x, y, distance, direction: 90 });

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
        x: distance,
        y: 0
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
  const gesture = gestures.swipe({ x: 100, y: 100, distance: 200, direction: 0, duration });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove", duration }),
        expect.objectContaining({ type: "pointerUp" })
      ]
    })
  ]);
});