const commands = require("./commands");

const restartApp = (sessionId, capabilities) => {
  if (!capabilities.noReset) {
    return Promise.reject(new Error("'noReset' must be set to 'true' in session capabilities to use this command."));
  }

  return commands.device.app.resetApp(sessionId)
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to restart the application.");
      }
    });
};

const resetApp = (sessionId, capabilities) => {
  if (capabilities.noReset) {
    return Promise.reject(new Error("'noReset' must not be set to 'true' in session capabilities to use this command."));
  }

  return commands.device.app.resetApp(sessionId)
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to reset the application.");
      }
    });
};

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
  resetApp,
  restartApp,
  getViewport,
  performGesture
};