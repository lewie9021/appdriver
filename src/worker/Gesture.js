const { isNumber } = require("../utils");

class Gesture {
  constructor() {
    this.actions = [];
  }

  async resolve() {
    const resolvedActions = await Promise.all(
      this.actions.map(async (action) => {
        if (action.element) {
          const ref = await action.element._getRef();
          const location = await action.element.getLocation();

          return {
            ...action,
            element: ref,
            x: location.x + (action.x || 0),
            y: location.y + (action.y || 0)
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

  press({ x, y, relative = false, element = null } = {}) {
    if (isNumber(x) || isNumber(y)) {
      this.moveTo({
        relative,
        element,
        x: x || 0,
        y: y || 0
      });
    }

    this.actions.push({
      type: "press"
    });

    return this;
  }

  wait(duration) {
    this.actions.push({
      type: "wait",
      duration
    });

    return this;
  }

  moveTo({ x, y, relative = false, duration = 0, element = null }) {
    this.actions.push({
      type: "move",
      relative,
      duration,
      element,
      x: x || 0,
      y: y || 0
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