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

const create = () => {
  return new Gesture();
};

const longPress = ({x, y, duration = 750, element}) => {
  return create()
    .press({x, y, element})
    .wait({duration})
    .release();
};

// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipe = ({ x, y, direction, distance, element, duration = 50 }) => {
  const relativePoint = getRelativePoint({ direction, distance });

  return create()
    .press({ x, y, element })
    .wait({ duration: 250 })
    .moveTo({ x: relativePoint.x, y: relativePoint.y, relative: true, duration })
    .release();
};

const swipeLeft = ({ x, y, distance, element, duration = 50 }) => {
  return swipe({ x, y, distance, duration, element, direction: 270 });
};

const swipeRight = ({ x, y, distance, element, duration = 50 }) => {
  return swipe({ x, y, distance, duration, element, direction: 90 });
};

const swipeUp = ({ x, y, distance, element, duration = 50 }) => {
  return swipe({ x, y, distance, element, duration, direction: 0 });
};

const swipeDown = ({x, y, distance, duration = 50}) => {
  return swipe({ x, y, distance, duration, direction: 180 });
};

module.exports = {
  create,
  swipe,
  swipeUp,
  swipeDown,
  longPress,
  swipeLeft,
  swipeRight
};