const { sessionStore } = require("../../stores/sessionStore");
const { appiumService } = require("../appiumService");
const gestures = require("../../gestures");

// ({ sessionId: String?, x: Number, y: Number, direction: Number, distance: Number }) => Promise.
const scroll = async ({ sessionId = sessionStore.getSessionId(), x, y, direction, distance }) => {
  const gesture = gestures.scroll({ x, y, direction, distance });

  return appiumService.performActions({
    sessionId,
    actions: gesture.resolve()
  });
};

module.exports = scroll;