const commands = require("./commands");

const restartApp = (capabilities) => {
  if (!capabilities.noReset) {
    return Promise.reject(new Error("'noReset' must be set to 'true' in session capabilities to use this command."));
  }

  return commands.device.app.resetApp()
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to restart the application.");
      }
    });
};

const resetApp = (capabilities) => {
  if (capabilities.noReset) {
    return Promise.reject(new Error("'noReset' must not be set to 'true' in session capabilities to use this command."));
  }

  return commands.device.app.resetApp()
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to reset the application.");
      }
    });
};

const getViewport = () => {
  return commands.session.getWindowRect()
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

const performGesture = (actions) => {
  return commands.interactions.actions(actions)
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