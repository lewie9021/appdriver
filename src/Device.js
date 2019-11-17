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
      .catch(handleActionError("Failed to perform gesture."));
  }

  getOrientation() {
    return appiumService.getOrientation()
      .catch(handleActionError("Failed to get device orientation."));
  }

  setOrientation(orientation) {
    return appiumService.setOrientation({ orientation })
      .catch(handleActionError(`Failed to set device orientation to '${orientation}'.`));
  }

  async swipe({ x = 0, y = 0, distance, direction, duration = 50 }) {
    const swipeGesture = gestures.swipe({ x, y, distance, direction, duration });

    return appiumService.performActions({ actions: await swipeGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe gesture."));
  }

  async swipeLeft({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.width * percentage;
    }

    const swipeLeftGesture = gestures.swipeLeft({ x, y, distance: swipeDistance, duration });

    return appiumService.performActions({ actions: await swipeLeftGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe left gesture."));
  }

  async swipeRight({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.width * percentage;
    }

    const swipeRightGesture = gestures.swipeRight({ x, y, distance: swipeDistance, duration });

    return appiumService.performActions({ actions: await swipeRightGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe right gesture."));
  }

  async swipeUp({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.height * percentage;
    }

    const swipeUpGesture = gestures.swipeUp({ x, y, distance: swipeDistance, duration });

    return appiumService.performActions({ actions: await swipeUpGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe up gesture."));
  }

  async swipeDown({ x = 0, y = 0, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.height * percentage;
    }

    const swipeDownGesture = gestures.swipeDown({ x, y, distance: swipeDistance, duration });

    return appiumService.performActions({ actions: await swipeDownGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe down gesture."));
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
              return reject(new ActionError("Failed to store screenshot on disk."));
            }

            resolve(buffer);
          });
        });
      })
      .catch(handleActionError("Failed to take screenshot."));
  }

  goBack() {
    return appiumService.goBack()
      .catch(handleActionError("Failed to go back."));
  }

  startScreenRecording(opts = {}) {
    const { filePath = null, maxDuration = 180, forceRestart = false } = opts;
    const { format = "mpeg4", quality = "medium", fps = 10, size = null } = opts;

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

    const options = platform.select({
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
    });

    return appiumService.startScreenRecording({ options })
      .catch(handleActionError("Failed to start screen recording."));
  }

  stopScreenRecording() {
    if (!sessionStore.getScreenRecording()) {
      return Promise.reject(new ActionError("No screen recording in progress to stop."));
    }

    const filePath = sessionStore.getScreenRecording("filePath");

    return appiumService.stopScreenRecording()
      .finally(() => sessionStore.setState({ screenRecording: null }))
      .then((value) => {
        const buffer = Buffer.from(value, "base64");

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
      })
      .catch(handleActionError("Failed to stop screen recording."));
  }
}

module.exports = {
  Device
};