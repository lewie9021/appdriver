const { isNumber } = require("./utils");

class Gesture {
  constructor() {
    this.actions = [];
  }

  async resolve() {
    const resolvedActions = await Promise.all(
      this.actions.map(async (action) => {
        if (action.element) {
          const ref = await action.element._getRef();

          return {
            ...action,
            element: ref.ELEMENT
          };
        }

        return action;
      })
    );

    return [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: resolvedActions.reduce((result, action) => {
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
              origin: action.relative
                ? "pointer"
                : action.element
                  ? { element: action.element }
                  : "viewport",
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

  // TODO: What about options.element without x and y?
  press(options = {}) {
    // TODO: What if only x or y is passed. The user wouldn't know that their coordinate is ignored.
    if (isNumber(options.x) && isNumber(options.y)) {
      this.moveTo({
        x: options.x,
        y: options.y,
        relative: options.relative,
        element: options.element
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
    const element = options.element || null;
    const x = options.x;
    const y = options.y;

    this.actions.push({
      type: "move",
      relative,
      duration,
      element,
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