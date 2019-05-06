const { isNumber } = require("./utils");

class Gesture {
  constructor() {
    this.actions = [];
  }

  async resolve() {
    return [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: this.actions.reduce((result, action) => {
        switch (action.type) {
          case "press":
            return result.concat([{
              type: "pointerDown",
              button: 0
            }]);
          case "wait":
            return result.concat([{
              type: "pause",
              duration: action.duration
            }]);
          case "move":
            return result.concat([{
              type: "pointerMove",
              duration: action.duration,
              origin: action.relative ? "pointer" : "viewport",
              x: action.x,
              y: action.y
            }]);
          case "release":
            return result.concat([{
              type: "pointerUp",
              button: 0
            }]);
          default:
            return result;
        }
      }, [])
    }];
  }

  press(options = {}) {
    if (isNumber(options.x) && isNumber(options.y)) {
      this.moveTo({
        x: options.x,
        y: options.y,
        relative: options.relative
      });
    }

    this.actions.push({
      type: "press"
    });

    return this;
  }

  wait(options) {
    const duration = options.duration;

    this.actions.push({
      type: "wait",
      duration
    });

    return this;
  }

  moveTo(options) {
    const relative = options.relative || false;
    const duration = options.duration || 0;
    const x = options.x;
    const y = options.y;

    this.actions.push({
      type: "move",
      relative,
      duration,
      x,
      y
    });

    return this;
  }

  release() {
    this.actions.push({
      type: "release"
    });

    return this;
  }
}

module.exports = Gesture;