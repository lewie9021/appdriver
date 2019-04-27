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

module.exports = {
  getViewport
};