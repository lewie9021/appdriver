const Gesture = require("./Gesture-v2");

const press = () => {
  return new Gesture([[{
    type: "pointerDown",
    button: 0
  }]]);
};

const release = () => {
  return new Gesture([[{
    type: "pointerUp",
    button: 0
  }]]);
};

const wait = (duration) => {
  return new Gesture([[{
    type: "pause",
    duration
  }]]);
};

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

const parallel = (gestures) => {
  if (!gestures.length) {
    throw new Error("You must pass at least one gesture.");
  }

  // gesture one -> [[moveTo], [press], [wait], [release]]
  // gesture two -> [[moveTo], [press], [wait[, [release[]
  // output -> [[moveTo, moveTo], [press, press], [wait, wait], [release, release]]

  return new Gesture(  gestures.reduce((result, gesture) => {
    gesture.inputs.forEach((actions, index) => {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(...actions);
    });

    return result;
  }, []));
};

module.exports = {
  press,
  release,
  wait,
  moveTo,
  series,
  parallel
};