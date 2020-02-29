const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.longPress({ x: 100, y: 100 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a long press gesture", () => {
  const x = 100;
  const y = 300;
  const gesture = gestures.longPress({ x, y });

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
        duration: 750
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
  const gesture = gestures.longPress({ x: 100, y: 100, duration });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause", duration }),
        expect.objectContaining({ type: "pointerUp" })
      ]
    })
  ]);
});