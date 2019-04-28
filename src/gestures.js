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
const swipeLeft = ({x, y, distance}) => ({
  id: "finger1",
  type: "pointer",
  parameters: {
    pointerType: "touch"
  },
  actions: [
    {type: "pointerMove", duration: 0, origin: "viewport", x, y},
    {type: "pointerDown", button: 0},
    {type: "pause", duration: 250},
    {type: "pointerMove", duration: 50, origin: "pointer", x: distance * -1, y: 0},
    {type: "pointerUp", button: 0},
    {type: "pause", duration: 500}
  ]
});

const swipeRight = {
  "type": "pointer",
  "id": "finger1",
  "parameters": {"pointerType": "touch"},
  "actions": [
    {"type": "pointerMove", "duration": 0, "origin": "viewport", "x": 150, "y": 150},
    {"type": "pointerDown", "button": 0},
    {"type": "pause", "duration": 500},
    {"type": "pointerMove", "duration": 1000, "origin": "pointer", "x": 100, "y": 0},
    {"type": "pointerUp", "button": 0}
  ]
};

module.exports = {
  swipeUp,
  swipeDown,
  swipeLeft,
  swipeRight
};