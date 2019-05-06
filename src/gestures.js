const Gesture = require("./Gesture");

const create = () => {
  return new Gesture();
};

const swipeUp = {
  "type": "pointer",
  "id": "finger1",
  "parameters": {"pointerType": "touch"},
  "actions": [
    {"type": "pointerMove", "duration": 0, "origin": "viewport", "x": 100, "y": 250},
    {"type": "pointerDown", "button": 0},
    {"type": "pause", "duration": 500},
    {"type": "pointerMove", "duration": 1000, "origin": "pointer", "x": 0, "y": -100},
    {"type": "pointerUp", "button": 0}
  ]
};

const swipeDown = {
  "type": "pointer",
  "id": "finger1",
  "parameters": {"pointerType": "touch"},
  "actions": [
    {"type": "pointerMove", "duration": 0, "origin": "viewport", "x": 100, "y": 150},
    {"type": "pointerDown", "button": 0},
    {"type": "pause", "duration": 500},
    {"type": "pointerMove", "duration": 1000, "origin": "pointer", "x": 0, "y": 100},
    {"type": "pointerUp", "button": 0}
  ]
};

// Note: Having type: "pointerMove", origin: "pointer", and duration: <= 10 doesn't work on Android.
const swipeLeft = ({x, y, distance}) => {
  const gesture = create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: distance, y: 0, relative: true, duration: 50})
    .release();

  return gesture._getActions();
};

const swipeRight = ({x, y, distance}) => {
  const gesture = create()
    .press({x, y})
    .wait({duration: 250})
    .moveTo({x: distance * -1, y: 0, relative: true, duration: 50})
    .release();

  return gesture._getActions();
};

module.exports = {
  create,
  swipeUp,
  swipeDown,
  swipeLeft,
  swipeRight
};