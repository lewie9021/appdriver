const Gesture = require("./Gesture");

const getRelativePoint = ({ direction, distance }) => {
  const radians = direction * (Math.PI / 180);
  const x = Math.round(Math.sin(radians) * distance);
  const y = Math.round(Math.cos(radians) * distance);

  return {
    x: x,
    y: y === -0
      ? 0
      : y * -1
  };
};

// (options: Object) => Gesture
const moveTo = (options) => {
  return new Gesture()
    .moveTo(options);
};

// (options: Object) => Gesture
const press = (options) => {
  return new Gesture()
    .press(options);
};

// () => Gesture
const release = () => {
  return new Gesture()
    .release();
};

// (duration: Number) => Gesture
const wait = (duration) => {
  return new Gesture()
    .wait(duration);
};

// (options: Object) => Gesture
const tap = ({ x, y, element }) => {
  return new Gesture()
    .press({ x, y, element })
    .wait(100)
    .release();
};

// (options: Object) => Gesture
const longPress = ({ x, y, duration = 750, element }) => {
  return new Gesture()
    .press({ x, y, element })
    .wait(duration)
    .release();
};

// (options: Object) => Gesture
// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipe = ({ x, y, direction, distance, duration = 50 }) => {
  const relativePoint = getRelativePoint({ direction, distance });

  return new Gesture()
    .press({ x, y })
    .wait(250)
    .moveTo({ x: relativePoint.x, y: relativePoint.y, relative: true, duration })
    .release();
};

// (options: Object) => Gesture
const swipeLeft = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 270 });
};

// (options: Object) => Gesture
const swipeRight = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 90 });
};

// (options: Object) => Gesture
const swipeUp = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 0 });
};

// (options: Object) => Gesture
const swipeDown = ({ x, y, distance, duration = 50 }) => {
  return swipe({ x, y, distance, duration, direction: 180 });
};


// (actions: Array<Gesture>) => Gesture
const series = (gestures) => {
  // TODO.
};

// (gestures: Array<Gesture>) => Gesture
const parallel = (gestures) => {
  // TODO.
};

module.exports = {
  moveTo,
  press,
  release,
  wait,

  series,
  parallel,

  tap,
  longPress,

  swipe,
  swipeLeft,
  swipeRight,
  swipeUp,
  swipeDown
};