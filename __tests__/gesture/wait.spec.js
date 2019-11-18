const Gesture = require("../../src/Gesture");

it("adds a wait action to the sequence", () => {
  const gesture = new Gesture();

  gesture.wait(100);

  return expect(gesture.resolve()).resolves.toEqual([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pause", duration: 100}
    ]
  }]);
});

it("allows function chaining", () => {
  const gesture = new Gesture();

  const result = gesture.wait(100);

  expect(result).toBeInstanceOf(Gesture);
});