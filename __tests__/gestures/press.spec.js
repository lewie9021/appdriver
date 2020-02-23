const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  expect(gestures.press()).toBeInstanceOf(Gesture);
});

it("correctly resolves to a press gesture", () => {
  const gesture = gestures.press();

  expect(gesture.resolve()).toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [{
      button: 0,
      type: "pointerDown"
    }]
  }]);
});