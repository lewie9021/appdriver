class Gesture {
  constructor() {
    this.actions = [];
  }

  _getActions() {
    return {
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: this.actions.reduce((result, action) => {
        switch (action.type) {
          case "press":
            return result.concat([
              {type: "pointerDown", button: 0}
            ]);
          case "wait":
            return result.concat([
              {type: "pause", duration: action.duration}
            ]);
          case "move":
            return result.concat([
              {type: "pointerMove", duration: action.duration, origin: "viewport", x: action.x, y: action.y}
            ]);
          default:
            return result;
        }

        return result;
      }, [])
    };
  }

  press() {
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
    const duration = options.duration || 0;
    const x = options.x;
    const y = options.y;

    this.actions.push({
      type: "move",
      duration,
      x,
      y
    });

    return this;
  }
}

module.exports = Gesture;