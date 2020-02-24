const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  expect(gestures.release()).toBeInstanceOf(Gesture);
});

it("correctly resolves to a release gesture", () => {
  const gesture = gestures.release();

  expect(gesture.resolve()).toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [{
      button: 0,
      type: "pointerUp"
    }]
  }]);
});