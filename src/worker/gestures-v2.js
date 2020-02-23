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

module.exports = {
  press,
  release,
  wait,
  moveTo
};