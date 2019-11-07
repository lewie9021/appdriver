const fs = require("fs");
const { sessionStore } = require("./stores/sessionStore");
const { appiumService } = require("./services/appiumService");
const gestures = require("./gestures");
const { delay, isUndefined, isInstanceOf, platform } = require("./utils");
const { ActionError, AppiumError } = require("./errors");

const handleActionError = (message) => (err) => {
  if (isInstanceOf(err, AppiumError)) {
    throw new ActionError(message);
  }

  throw err;
};

class Device {

  get name() {
    return sessionStore.getCapabilities("deviceName");
  }

  get platformName() {
    return sessionStore.getCapabilities("platformName");
  }

  get platformVersion() {
    return sessionStore.getCapabilities("platformVersion");
  }

  restartApp(capabilities) {
    if (!capabilities.noReset) {
      return Promise.reject(new ActionError("'noReset' must be 'true' in session capabilities to use this command."));
    }

    return appiumService.resetApp()
      .catch(() => {
        throw new ActionError("Failed to restart the application.");
      })
  }

  resetApp(capabilities) {
    if (capabilities.noReset) {
      return Promise.reject(new ActionError("'noReset' must not be 'true' in session capabilities to use this command."));
    }

    return appiumService.resetApp()
      .catch(() => {
        throw new ActionError("Failed to reset the application.");
      });
  }

  getViewport() {
    return appiumService.getViewport()
      .catch(handleActionError("Failed to get device viewport."));
  }

  async performGesture(gesture) {
    const actions = await gesture.resolve();

    return appiumService.performActions({ actions })
      .catch(() => {
        throw new ActionError("Failed to perform gesture.");
      });
  }

  getOrientation() {
    return appiumService.getOrientation();
  }

  setOrientation(orientation) {
    return appiumService.setOrientation({ orientation });
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
    return appiumService.hideKeyboard()
      .then(() => delay(500))
      .catch(handleActionError("Failed to hide keyboard."));
  }

  isKeyboardVisible() {
    return appiumService.getKeyboardVisible()
      .catch(handleActionError("Failed to get keyboard visibility status."));
  }

  takeScreenshot({ filePath } = {}) {
    return appiumService.takeScreenshot()
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
    return appiumService.goBack()
      .catch(handleActionError("Failed to go back."));
  }

  startScreenRecording(options = {}) {
    const { filePath = null, maxDuration = 180, forceRestart = false } = options;
    const { format = "mpeg4", quality = "medium", fps = 10, size = null } = options;

    if (size) {
      if (!size.width && !size.height) {
        return Promise.reject(new ActionError("You must provide a 'size.width' and 'size.height' when passing a 'size'."))
      }

      if (size.width && !size.height) {
        return Promise.reject(new ActionError("You must provide a 'size.height' when passing a 'size.width'."))
      }

      if (size.height && !size.width) {
        return Promise.reject(new ActionError("You must provide a 'size.width' when passing a 'size.height'."))
      }
    }

    if (sessionStore.getScreenRecording()) {
      return Promise.reject(new ActionError("Screen recording already in progress."));
    }

    sessionStore.setState({
      screenRecording: { filePath }
    });

    return appiumService.startScreenRecording({
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
    if (!sessionStore.getScreenRecording()) {
      return Promise.reject(new ActionError("No screen recording in progress to stop."));
    }

    const filePath = sessionStore.getScreenRecording("filePath");

    return appiumService.stopScreenRecording()
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
  Device
};