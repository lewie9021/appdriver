const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.doubleTap({ x: 100, y: 100 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a double tap gesture", () => {
  const x = 100;
  const y = 300;
  const gesture = gestures.doubleTap({ x, y });

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
        duration: 100
      },
      {
        type: "pointerUp",
        button: 0
      },
      {
        type: "pause",
        duration: 100
      },
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
        duration: 100
      },
      {
        type: "pointerUp",
        button: 0
      }
    ]
  }]);
});