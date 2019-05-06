const Gesture = require("../src/Gesture");
const gestures = require("../src/gestures");

describe("create", () => {
  it("returns a 'Gesture'", () => {
    const result = gestures.create();

    expect(result).toBeInstanceOf(Gesture);
  });
});