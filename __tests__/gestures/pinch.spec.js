const Gesture = require("../../src/worker/Gesture");
const gestures = require("../../src/worker/gestures");

it("returns a Gesture instance", () => {
  const gesture = gestures.pinch({ x: 100, y: 100, distance: 25 });

  expect(gesture).toBeInstanceOf(Gesture);
});

it("correctly resolves to a pinch gesture", () => {
  const x = 200;
  const y = 300;
  const distance = 25;
  const gesture = gestures.pinch({ x, y, distance });

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
          x: x - distance,
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
          duration: 200,
          x: distance,
          y: 0
        },
        {
          type: "pointerUp",
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
          type: "pointerMove",
          origin: "viewport",
          duration: 0,
          x: x + distance,
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
          duration: 200,
          x: distance * -1,
          y: 0
        },
        {
          type: "pointerUp",
          button: 0
        }
      ]
    }
  ]);
});

it("supports passing a duration parameter", () => {
  const duration = 2000;
  const gesture = gestures.pinch({ x: 100, y: 100, distance: 200, duration });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      id: "finger1",
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove", duration }),
        expect.objectContaining({ type: "pointerUp" }),
      ]
    }),
    expect.objectContaining({
      id: "finger2",
      actions: [
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove", duration }),
        expect.objectContaining({ type: "pointerUp" }),
      ]
    })
  ]);
});

it("supports passing a direction parameter", () => {
  const x = 100;
  const y = 100;
  const distance = 25;
  const gesture = gestures.pinch({ x, y, distance, direction: 180 });

  expect(gesture.resolve()).toEqual([
    expect.objectContaining({
      id: "finger1",
      actions: [
        expect.objectContaining({ type: "pointerMove", x, y: y - distance }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerUp" }),
      ]
    }),
    expect.objectContaining({
      id: "finger2",
      actions: [
        expect.objectContaining({ type: "pointerMove", x, y: y + distance }),
        expect.objectContaining({ type: "pointerDown" }),
        expect.objectContaining({ type: "pause" }),
        expect.objectContaining({ type: "pointerMove" }),
        expect.objectContaining({ type: "pointerUp" }),
      ]
    })
  ]);
});