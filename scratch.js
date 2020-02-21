const gestures = {
  series: () => {},
  parallel: () => {},
  press: () => {},
  wait: (duration) => {},
  release: () => {},
  tap: () => {},
  longPress: () => {},
  swipeLeft: () => {},
  swipeRight: () => {}
};

const doubleTap = gestures.series([
  gestures.tap(),
  gestures.wait(50),
  gestures.tap()
]);

const spread = gestures.parallel([
  gestures.swipeLeft(),
  gestures.swipeRight()
]);

const pinch = gestures.parallel([
  gestures.swipeRight(),
  gestures.swipeLeft()
]);

const exampleGesture = gestures.series([
  gestures.series([
    gestures.press(),
    gestures.wait(200),
    gestures.release()
  ]),
  gestures.series([
    gestures.tap(),
    gestures.longPress()
  ]),
  gestures.parallel([
    gestures.swipeLeft(),
    gestures.swipeRight()
  ])
]);

const exampleOutput = [
  {
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      // Standalone actions.
      { type: "pointerDown", button: 0 },
      { type: "wait", duration: 200 },
      { type: "pointerUp", button: 0 },

      // Tap actions.
      { type: "pointerDown", button: 0 },
      { type: "wait", duration: 100 },
      { type: "pointerUp", button: 0 },

      // Long press actions.
      { type: "pointerDown", button: 0 },
      { type: "wait", duration: 750 },
      { type: "pointerUp", button: 0 },

      // Spread actions (swipe left).
      { type: "pointerDown", button: 0 },
      { type: "wait", duration: 200 },
      { type: "pointerMove", duration: 50, origin: "pointer", x: -100, y: 0 },
      { type: "pointerUp", button: 0 },
    ]
  },
  {
    id: "finger2",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      // Standalone actions.
      { type: "pause" }, // Do nothing while finger1 performs press.
      { type: "pause" }, // Do nothing while finger1 performs wait for 200ms.
      { type: "pause" }, // Do nothing while finger1 performs release.

      // Tap actions.
      { type: "pause" }, // Do nothing while finger1 performs press.
      { type: "pause" }, // Do nothing while finger1 performs wait for 100ms.
      { type: "pause" }, // Do nothing while finger1 performs release.

      // Long press actions.
      { type: "pause" }, // Do nothing while finger1 performs press.
      { type: "pause" }, // Do nothing while finger1 performs wait for 750ms.
      { type: "pause" }, // Do nothing while finger1 performs release.

      // Spread actions (swipe right).
      { type: "pointerDown", button: 0 },
      { type: "wait", duration: 200 },
      { type: "pointerMove", duration: 50, origin: "pointer", x: 100, y: 0 },
      { type: "pointerUp", button: 0 },
    ]
  }
];