const Gesture = require("../../src/worker/Gesture");

it("adds a release action to the sequence", () => {
  const gesture = new Gesture();

  gesture.release();

  expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("allows function chaining", () => {
  const gesture = new Gesture();

  const result = gesture.release();

  expect(result).toBeInstanceOf(Gesture);
});