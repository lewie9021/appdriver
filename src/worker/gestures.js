const Gesture = require("./Gesture");

const getRelativePoint = ({ x = 0, y = 0, direction, distance }) => {
  const radians = direction * (Math.PI / 180);
  const x2 = Math.round(Math.sin(radians) * distance);
  const y2 = Math.round(Math.cos(radians) * distance);

  return {
    x: x + x2,
    y: y + (y2 === -0 ? 0 : y2 * -1)
  };
};

// () => Gesture
const press = () => {
  return new Gesture([[{
    type: "pointerDown",
    button: 0
  }]]);
};

// () => Gesture
const release = () => {
  return new Gesture([[{
    type: "pointerUp",
    button: 0
  }]]);
};

// (duration: Number) => Gesture
const wait = (duration) => {
  return new Gesture([[{
    type: "pause",
    duration
  }]]);
};

// (options: Object) => Gesture
const moveTo = ({ x, y, duration = 0, relative = false }) => {
  return new Gesture([[{
    type: "pointerMove",
    origin: relative
      ? "pointer"
      : "viewport",
    duration,
    x,
    y
  }]]);
};

// (gestures: Array<Gesture>) => Gesture
const series = (gestures) => {
  if (!gestures.length) {
    throw new Error("You must pass at least one gesture.");
  }

  if (gestures.length === 1) {
    return gestures[0];
  }

  return new Gesture(gestures.reduce((result, gesture) => {
    result.push(...gesture.inputs);

    return result;
  }, []));
};

// (gestures: Array<Gesture>) => Gesture
const parallel = (gestures) => {
  if (!gestures.length) {
    throw new Error("You must pass at least one gesture.");
  }

  // gesture one -> [[moveTo], [press], [wait], [release]]
  // gesture two -> [[moveTo], [press], [wait[, [release[]
  // output -> [[moveTo, moveTo], [press, press], [wait, wait], [release, release]]
  return new Gesture(gestures.reduce((result, gesture) => {
    gesture.inputs.forEach((actions, index) => {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(...actions);
    });

    return result;
  }, []));
};

// (options: Object) => Gesture
const tap = ({ x, y }) => {
  return series([
    moveTo({ x, y }),
    press(),
    wait(100),
    release()
  ]);
};

// (options: Object) => Gesture
const doubleTap = ({ x, y }) => {
  return series([
    tap({ x, y }),
    wait(100),
    tap({ x, y })
  ]);
};

// (options: Object) => Gesture
const longPress = ({ x, y, duration = 750 }) => {
  return series([
    moveTo({ x, y }),
    press(),
    wait(duration),
    release()
  ]);
};

// (options: Object) => Gesture
// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipe = ({ x, y, direction, distance, duration = 50 }) => {
  const relativePoint = getRelativePoint({ direction, distance });

  return series([
    moveTo({ x, y }),
    press(),
    wait(250),
    moveTo({ x: relativePoint.x, y: relativePoint.y, relative: true, duration }),
    release()
  ]);
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

// (options: Object) => Gesture
const spread = ({ x, y, distance, direction = 90, duration = 200 }) => {
  return parallel([
    swipe({ x, y, distance, direction: (direction + 180) % 360, duration }),
    swipe({ x, y, distance, direction: direction % 360, duration })
  ]);
};

// (options: Object) => Gesture
const pinch = ({ x, y, distance, direction = 90, duration = 200 }) => {
  return parallel([
    swipe({
      ...getRelativePoint({ x, y, distance, direction: (direction + 180) % 360 }),
      distance,
      direction: direction % 360,
      duration
    }),
    swipe({
      ...getRelativePoint({ x, y, distance, direction: direction % 360 }),
      distance,
      direction: (direction + 180) % 360,
      duration
    })
  ]);
};

module.exports = {
  press,
  release,
  wait,
  moveTo,

  series,
  parallel,

  tap,
  doubleTap,
  longPress,

  swipe,
  swipeLeft,
  swipeRight,
  swipeUp,
  swipeDown,

  spread,
  pinch
};
