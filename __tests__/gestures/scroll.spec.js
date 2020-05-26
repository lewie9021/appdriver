const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.scroll({ x: 100, y: 100, distance: 200, direction: 180 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a scroll gesture", () => {
  const x = 200;
  const y = 300;
  const distance = 25;
  const gesture = gestures.scroll({ x, y, distance, direction: 180 });

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
        duration: 100,
        x: 0,
        y: distance * -1
      },
      {
        type: "pointerUp",
        button: 0
      }
    ]
  }]);
});

it("splits the distance into steps of 25 (or less) to reduce swipe acceleration", () => {
  const gesture = gestures.scroll({ x: 100, y: 100, distance: 140, direction: 0 });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove", y: 25 }),
        expect.objectContaining({ type: "pointerMove", y: 25 }),
        expect.objectContaining({ type: "pointerMove", y: 25 }),
        expect.objectContaining({ type: "pointerMove", y: 25 }),
        expect.objectContaining({ type: "pointerMove", y: 25 }),
        expect.objectContaining({ type: "pointerMove", y: 15 }),
        expect.objectContaining({ type: "pointerUp" })
      ]
    })
  ]);
});