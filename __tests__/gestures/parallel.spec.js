const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.parallel([
    gestures.press(),
    gestures.press()
  ]);

  expect(gesture).toBeInstanceOf(Gesture);
});

it("joins together a list of gestures in parallel", () => {
  const gesture = gestures.parallel([
    gestures.press(),
    gestures.press()
  ]);

  expect(gesture.resolve()).toEqual([
    {
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {
          type: "pointerDown",
          button: 0
        }
      ]
    },
    {
      id: "finger2",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {
          type: "pointerDown",
          button: 0
        }
      ]
    }
  ]);
});

it("handles gaps with no-op pauses", () => {
  const x = 100;
  const y = 200;
  const duration = 50;
  const gesture = gestures.parallel([
    gestures.series([
      gestures.moveTo({ x, y }),
      gestures.press(),
      gestures.wait(duration),
      gestures.release()
    ]),
    gestures.press()
  ]);

  expect(gesture.resolve()).toEqual([
    {
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
          duration
        },
        {
          type: "pointerUp",
          button: 0
        },
      ]
    },
    {
      id: "finger2",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {
          type: "pointerDown",
          button: 0
        },
        {
          type: "pause"
        },
        {
          type: "pause"
        },
        {
          type: "pause"
        }
      ]
    }
  ]);
});

it("returns the same gesture when one gesture is passed", () => {
  const press = gestures.press();
  const gesture = gestures.parallel([ press ]);

  expect(gesture.resolve()).toEqual(press.resolve());
});

it("throws if an empty list of gestures is passed", () => {
  expect.assertions(2);

  try {
    gestures.parallel([]);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", "You must pass at least one gesture.");
  }
});