const { sessionStore } = require("../../stores/sessionStore");
const { appiumService } = require("../appiumService");
const { platform } = require("../../../utils");
const { getRelativePoint } = require("../../helpers/coordinates");
const gestures = require("../../gestures");

// ({ sessionId: String?, x: Number, y: Number, direction: Number, distance: Number }) => Promise.
const scroll = async ({ sessionId = sessionStore.getSessionId(), x, y, direction, distance }) => {
  return platform.select({
    native: () => {
      const gesture = gestures.scroll({ x, y, direction, distance });

      return appiumService.performActions({
        sessionId,
        actions: gesture.resolve()
      });
    },
    web: () => {
      const relativePoint = getRelativePoint({ x, y, direction, distance });

      return appiumService.execute({
        sessionId,
        script: "window.scrollBy(arguments[0], arguments[1])",
        args: [
          relativePoint.x,
          relativePoint.y
        ]
      });
    }
  });
};

module.exports = scroll;