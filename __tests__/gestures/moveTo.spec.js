const Gesture = require("../../src/worker/Gesture-v2");
const gestures = require("../../src/worker/gestures-v2");

it("returns a Gesture instance", () => {
  expect(gestures.moveTo({ x: 100, y: 100 })).toBeInstanceOf(Gesture);
});

it("correctly resolves to a moveTo gesture", () => {
  const x = 200;
  const y = 400;
  const gesture = gestures.moveTo({ x, y });

  expect(gesture.resolve()).toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [{
      type: "pointerMove",
      duration: 0,
      origin: "viewport",
      x,
      y
    }]
  }]);
});

it("supports passing a duration parameter", () => {
  const duration = 1000;
  const gesture = gestures.moveTo({ x: 100, y: 200, duration });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [
        expect.objectContaining({
          type: "pointerMove",
          duration
        })
      ]
    })
  ]);
});

it("supports passing a relative parameter", () => {
  const gesture = gestures.moveTo({ x: 100, y: 200, relative: true });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      actions: [expect.objectContaining({ origin: "pointer" })]
    })
  ]);
});