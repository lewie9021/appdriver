const fs = require("fs");
const commands = require("./commands");
const { getSession } = require("./session");
const gestures = require("./gestures");
const { delay, isUndefined } = require("./utils");
const { NotImplementedError } = require("./errors");

class Device {

  constructor() {
    this._screenRecording = null;
  }

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
    return commands.session.getOrientation();
  }

  setOrientation(orientation) {
    return commands.session.setOrientation(orientation);
  }

  async swipe({ x = 0, y = 0, distance, direction, duration }) {
    const gesture = gestures.swipe({ x, y, distance, direction, duration });

    return this.performGesture(gesture);
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

  takeScreenshot({ filePath } = {}) {
    if (!filePath) {
      return Promise.reject(new NotImplementedError());
    }

    return commands.device.takeScreenshot()
      .then((value) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, Buffer.from(value, "base64").toString(), (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      });
  }

  goBack() {
    return commands.device.back();
  }

  startScreenRecording({ filePath, format = "mpeg4", maxDuration = 180 } = {}) {
    if (this._screenRecording) {
      return Promise.reject(new Error("Screen recording already in progress."));
    }

    this._screenRecording = { filePath };

    return commands.device.startScreenRecording({
      options: {
        videoType: this.platformName === "iOS"
          ? format
          : null,
        timeLimit: maxDuration
      }
    });
  }

  stopScreenRecording() {
    if (!this._screenRecording) {
      return Promise.reject(new Error("No screen recording in progress to stop."));
    }

    const filePath = this._screenRecording.filePath;

    return commands.device.stopScreenRecording()
      .then((value) => {
        this._screenRecording = null;

        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, Buffer.from(value, "base64"), (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      });
  }
}

module.exports = new Device();