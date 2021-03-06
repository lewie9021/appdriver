const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  expect(gestures.wait(200)).toBeInstanceOf(Gesture);
});

it("correctly resolves to a wait gesture", () => {
  const duration = 1000;
  const gesture = gestures.wait(duration);

  expect(gesture.resolve()).toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [{
      type: "pause",
      duration
    }]
  }]);
});