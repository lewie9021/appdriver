const commands = require("./commands");

const getViewport = (sessionId) => {
  return commands.session.getWindowRect(sessionId)
    .then(({status, value}) => {
      if (status !== 0) {
        throw new Error("Failed to get device viewport.");
      }

      return {
        x: value.x,
        y: value.y,
        width: value.width,
        height: value.height
      }
    });
};

const performGesture = (sessionId, actions) => {
  return commands.session.executeActions(sessionId, actions)
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to perform gesture.");
      }
    });
};

module.exports = {
  getViewport,
  performGesture
};