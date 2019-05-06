const commands = require("./commands");

const restartApp = (capabilities) => {
  if (!capabilities.noReset) {
    return Promise.reject(new Error("'noReset' must be 'true' in session capabilities to use this command."));
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
    return Promise.reject(new Error("'noReset' must not be 'true' in session capabilities to use this command."));
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

const performGesture = async (gesture) => {
  const actions = await gesture.resolve();

  return commands.interactions.actions(actions)
    .then(({status}) => {
      if (status) {
        throw new Error("Failed to perform gesture.");
      }
    });
};

const getOrientation = () => {
  return commands.session.getOrientation()
    .then(({status, value}) => {
      if (status !== 0) {
        throw new Error("Failed to get orientation.");
      }

      return value;
    });
};

const setOrientation = (orientation) => {
  return commands.session.setOrientation(orientation)
    .then(({status}) => {
      if (status !== 0) {
        throw new Error("Failed to set orientation.");
      }
    });
};

module.exports = {
  resetApp,
  restartApp,
  getViewport,
  performGesture,
  getOrientation,
  setOrientation
};