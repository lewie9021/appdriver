const fs = require("fs");
const commands = require("./commands");
const { getSession } = require("./session");
const gestures = require("./gestures");
const { delay, isUndefined, platform } = require("./utils");
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
    return commands.device.takeScreenshot()
      .then((value) => {
        const buffer = Buffer.from(value, "base64");

        if (!filePath) {
          return Promise.resolve(buffer);
        }

        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, Buffer.from(value, "base64"), (err) => {
            if (err) {
              return reject(err);
            }

            resolve(buffer);
          });
        });
      });
  }

  goBack() {
    return commands.device.back();
  }

  startScreenRecording(options = {}) {
    const { filePath = null, maxDuration = 180, forceRestart = false } = options;
    const { format = "mpeg4", quality = "medium", fps = 10, size = null } = options;

    if (size) {
      if (!size.width && !size.height) {
        return Promise.reject(new Error("You must provide a 'size.width' and 'size.height' when passing a 'size'."))
      }

      if (size.width && !size.height) {
        return Promise.reject(new Error("You must provide a 'size.height' when passing a 'size.width'."))
      }

      if (size.height && !size.width) {
        return Promise.reject(new Error("You must provide a 'size.width' when passing a 'size.height'."))
      }
    }

    if (this._screenRecording) {
      return Promise.reject(new Error("Screen recording already in progress."));
    }

    this._screenRecording = { filePath };

    return commands.device.startScreenRecording({
      options: platform.select({
        ios: () => ({
          timeLimit: maxDuration,
          forceRestart,
          videoType: format,
          videoQuality: quality,
          videoFps: fps
        }),
        android: () => ({
          timeLimit: maxDuration,
          forceRestart,
          videoSize: size
            ? `${size.width}x${size.height}`
            : null
        })
      })
    });
  }

  stopScreenRecording() {
    if (!this._screenRecording) {
      return Promise.reject(new Error("No screen recording in progress to stop."));
    }

    const filePath = this._screenRecording.filePath;

    return commands.device.stopScreenRecording()
      .then((value) => {
        const buffer = Buffer.from(value, "base64");

        this._screenRecording = null;

        if (!filePath) {
          return Promise.resolve(buffer);
        }

        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              return reject(err);
            }

            resolve(buffer);
          });
        });
      });
  }
}

module.exports = {
  device: new Device(),
  Device
};