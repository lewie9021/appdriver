const Gesture = require("./Gesture");

const create = () => {
  return new Gesture();
};

const longPress = ({x, y, duration = 750}) => {
  return create()
    .press({x, y})
    .wait({duration})
    .release();
};

// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipeLeft = ({x, y, distance, duration = 50}) => {
  return create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: distance * -1, y: 0, relative: true, duration})
    .release();
};

const swipeRight = ({x, y, distance, duration = 50}) => {
  return create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: distance, y: 0, relative: true, duration})
    .release();
};

const swipeUp = ({x, y, distance, duration = 50}) => {
  return create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: 0, y: distance * -1, relative: true, duration})
    .release();
};

const swipeDown = ({x, y, distance, duration = 50}) => {
  return create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: 0, y: distance, relative: true, duration})
    .release();
};

module.exports = {
  create,
  swipeUp,
  swipeDown,
  longPress,
  swipeLeft,
  swipeRight
};