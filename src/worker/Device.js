const fs = require("fs");
const { configStore } = require("../stores/configStore");
const { sessionStore } = require("./stores/sessionStore");
const { appiumService } = require("./services/appiumService");
const gestures = require("./gestures");
const { Expect } = require("./Expect");
const { delay, isUndefined, isInstanceOf, pollFor, platform } = require("../utils");
const { ActionError, AppiumError, WaitError } = require("./errors");

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

  restartApp() {
    return appiumService.restartApp()
      .catch(() => {
        throw new ActionError("Failed to restart the application.");
      });
  }

  resetApp() {
    return appiumService.resetApp()
      .catch((e) => {
        console.log(e);
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

  isPortrait() {
    return appiumService.getOrientation()
      .then((orientation) => orientation === "PORTRAIT")
      .catch(handleActionError("Failed to get device orientation."));
  }

  async swipe({ x = 0, y = 0, distance, direction, duration = 50 }) {
    const swipeGesture = gestures.swipe({ x, y, distance, direction, duration });

    return appiumService.performActions({ actions: await swipeGesture.resolve() })
      .catch(handleActionError("Failed to perform swipe gesture."));
  }

  async swipeLeft({ x, y = 0, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.width * percentage;
    }

    const xOffset = isUndefined(x) ? swipeDistance : x;
    const swipeLeftGesture = gestures.swipeLeft({ x: xOffset, y, distance: swipeDistance, duration });

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

  async swipeUp({ x = 0, y, distance, percentage, duration = 50 }) {
    let swipeDistance = distance;

    if (percentage) {
      const viewport = await this.getViewport();

      swipeDistance = viewport.height * percentage;
    }

    const yOffset = isUndefined(y) ? swipeDistance : y;
    const swipeUpGesture = gestures.swipeUp({ x, y: yOffset, distance: swipeDistance, duration });

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

  waitFor(conditionFn, options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const timeoutMessage = `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return pollFor(conditionFn, { maxDuration, interval })
      .catch((errors) => { throw new WaitError(timeoutMessage, errors); });
  }

  hideKeyboard() {
    const maxDuration = 5000;
    const interval = 200;
    const timeoutMessage = `Failed to hide keyboard. Keyboard still visible after ${maxDuration}ms.`;

    return appiumService.hideKeyboard()
      .then(() => {
        return pollFor(async () => new Expect(await this.isKeyboardVisible()).toBeFalsy(), { maxDuration, interval })
          .catch(() => { throw new ActionError(timeoutMessage); });
      })
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