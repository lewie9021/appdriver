const commands = require("./commands");
const { getSession } = require("./session");
const gestures = require("./gestures");
const { delay, isUndefined } = require("./utils");

class Device {
  get name() {
    return getSession("deviceName");
  }

  get platformName() {
    return getSession("platformName");
  }

  get platformVersion() {
    return getSession("platformVersion");
  }

  restartApp(capabilities) {
    if (!capabilities.noReset) {
      return Promise.reject(new Error("'noReset' must be 'true' in session capabilities to use this command."));
    }

    return commands.device.app.resetApp()
      .then(({status}) => {
        if (status !== 0) {
          throw new Error("Failed to restart the application.");
        }
      });
  }

  resetApp(capabilities) {
    if (capabilities.noReset) {
      return Promise.reject(new Error("'noReset' must not be 'true' in session capabilities to use this command."));
    }

    return commands.device.app.resetApp()
      .then(({status}) => {
        if (status !== 0) {
          throw new Error("Failed to reset the application.");
        }
      });
  }

  getViewport() {
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
  }

  async performGesture(gesture) {
    const actions = await gesture.resolve();

    return commands.interactions.actions(actions)
      .then(({status}) => {
        if (status) {
          throw new Error("Failed to perform gesture.");
        }
      });
  }

  getOrientation() {
    return commands.session.getOrientation()
      .then(({status, value}) => {
        if (status !== 0) {
          throw new Error("Failed to get orientation.");
        }

        return value;
      });
  }

  setOrientation(orientation) {
    return commands.session.setOrientation(orientation)
      .then(({status}) => {
        if (status !== 0) {
          throw new Error("Failed to set orientation.");
        }
      });
  }

  async swipeLeft({ x, y, distance, percentage, duration }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.width * percentage;
    }

    const gesture = gestures.swipeLeft({
      x: isUndefined(x)
        ? swipeDistance
        : x,
      y: isUndefined(y)
        ? 0
        : y,
      distance: swipeDistance,
      duration
    });

    return this.performGesture(gesture);
  }

  async swipeRight({ x, y, distance, percentage, duration }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.width * percentage;
    }

    const gesture = gestures.swipeRight({
      x: isUndefined(x)
        ? 0
        : x,
      y: isUndefined(y)
        ? 0
        : y,
      distance: swipeDistance,
      duration
    });

    return this.performGesture(gesture);
  }

  async swipeUp({ x, y, distance, percentage, duration }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.height * percentage;
    }

    const gesture = gestures.swipeUp({
      x: isUndefined(x)
        ? 0
        : x,
      y: isUndefined(y)
        ? swipeDistance
        : y,
      distance: swipeDistance,
      duration
    });

    return this.performGesture(gesture);
  }

  async swipeDown({ x, y, distance, percentage, duration }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.height * percentage;
    }

    const gesture = gestures.swipeDown({
      x: isUndefined(x)
        ? 0
        : x,
      y: isUndefined(y)
        ? 0
        : y,
      distance: swipeDistance,
      duration
    });

    return this.performGesture(gesture);
  }

  wait(duration) {
    return delay(duration);
  }

  // TODO: Needs to use .waitFor + .isKeyboardVisible before returning back instead of delay.
  // Seems to fire and forget...
  hideKeyboard() {
    return commands.device.hideKeyboard()
      .then(() => delay(500));
  }

  isKeyboardVisible() {
    return commands.device.isKeyboardShown();
  }
}

module.exports = new Device();