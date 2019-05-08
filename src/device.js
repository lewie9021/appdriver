const commands = require("./commands");
const gestures = require("./gestures");
const { isUndefined } = require("./utils");

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

const swipeLeft = async ({x, y, distance, percentage, duration}) => {
  let swipeDistance = distance;

  if (percentage) {
    const viewport = await getViewport();

    swipeDistance = viewport.width * percentage;
  }

  const xCoordinate = isUndefined(x) ? swipeDistance : x;
  const yCoordinate = isUndefined(y) ? 0 : y;
  const gesture = gestures.swipeLeft({x: xCoordinate, y: yCoordinate, distance: swipeDistance, duration});

  return performGesture(gesture);
};

const swipeRight = async ({x, y, distance, percentage, duration}) => {
  let swipeDistance = distance;

  if (percentage) {
    const viewport = await getViewport();

    swipeDistance = viewport.width * percentage;
  }

  const xCoordinate = isUndefined(x) ? 0 : x;
  const yCoordinate = isUndefined(y) ? 0 : y;
  const gesture = gestures.swipeRight({x: xCoordinate, y: yCoordinate, distance: swipeDistance, duration});

  return performGesture(gesture);
};

const swipeUp = async ({x, y, distance, percentage, duration}) => {
  let swipeDistance = distance;

  if (percentage) {
    const viewport = await getViewport();

    swipeDistance = viewport.height * percentage;
  }

  const xCoordinate = isUndefined(x) ? 0 : x;
  const yCoordinate = isUndefined(y) ? swipeDistance : y;
  const gesture = gestures.swipeUp({x: xCoordinate, y: yCoordinate, distance: swipeDistance, duration});

  return performGesture(gesture);
};

const swipeDown = async ({x, y, distance, percentage, duration}) => {
  let swipeDistance = distance;

  if (percentage) {
    const viewport = await getViewport();

    swipeDistance = viewport.height * percentage;
  }

  const xCoordinate = isUndefined(x) ? 0 : x;
  const yCoordinate = isUndefined(y) ? 0 : y;
  const gesture = gestures.swipeDown({x: xCoordinate, y: yCoordinate, distance: swipeDistance, duration});

  return performGesture(gesture);
};

module.exports = {
  resetApp,
  restartApp,
  getViewport,
  performGesture,
  getOrientation,
  setOrientation,
  swipeLeft,
  swipeRight,
  swipeUp,
  swipeDown
};