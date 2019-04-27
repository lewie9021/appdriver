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

module.exports = {
  swipeUp,
  swipeDown
};