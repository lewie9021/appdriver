const fs = require("fs");
const { configStore } = require("../stores/configStore");
const { sessionStore } = require("./stores/sessionStore");
const { appiumService } = require("./services/appiumService");
const appdriverService = require("./services/appdriverService");
const gestures = require("./gestures");
const { Expect } = require("./Expect");
const { delay, isUndefined, isInstanceOf, pollWhile, pollFor, platform } = require("../utils");
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

  get platform() {
    const capabilities = sessionStore.getCapabilities();

    return {
      name: capabilities.platformName,
      version: capabilities.platformVersion
    };
  }

  get session() {
    return {
      sessionId: sessionStore.getSessionId(),
      capabilities: sessionStore.getCapabilities()
    };
  }

  restartApp() {
    return appiumService.restartApp()
      .catch(handleActionError("Failed to restart the application."));
  }

  resetApp() {
    return appiumService.resetApp()
      .catch(handleActionError("Failed to reset the application."));
  }

  getSource() {
    return appiumService.getSource()
      .catch(handleActionError("Failed to get source."));
  }

  getViewport() {
    return appiumService.getViewport()
      .catch(handleActionError("Failed to get viewport."));
  }

  async performGesture(gesture) {
    const actions = await gesture.resolve();

    return appiumService.performActions({ actions })
      .catch(handleActionError("Failed to perform gesture."));
  }

  isPortrait() {
    return appiumService.getOrientation()
      .then((orientation) => orientation === "PORTRAIT")
      .catch(handleActionError("Failed to get device orientation."));
  }

  setPortrait() {
    return appiumService.setOrientation({ orientation: "PORTRAIT" })
      .catch(handleActionError(`Failed to set device orientation to portrait.`));
  }

  setLandscape() {
    return appiumService.setOrientation({ orientation: "LANDSCAPE" })
      .catch(handleActionError(`Failed to set device orientation to landscape.`));
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

  async scroll({ x = 0, y = 0, direction, distance }) {
    return appdriverService.scroll({ x, y, direction, distance })
      .catch(handleActionError("Failed to perform scroll gesture."));
  }

  wait(duration) {
    return delay(duration);
  }

  waitFor(conditionFn, options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitTimeout();
    const interval = options.interval || configStore.getWaitInterval();
    const timeoutMessage = `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return pollFor(conditionFn, { maxDuration, interval })
      .catch((errors) => { throw new WaitError(timeoutMessage, errors); });
  }

  while(condition, action, options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitTimeout();
    const interval = options.interval || configStore.getWaitInterval();
    const timeoutMessage = `While exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return pollWhile(condition, action, { maxDuration, interval })
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
        return Promise.reject(
          new ActionError("You must provide a 'size.width' and 'size.height' when passing a 'size'.")
        );
      }

      if (size.width && !size.height) {
        return Promise.reject(
          new ActionError("You must provide a 'size.height' when passing a 'size.width'.")
        );
      }

      if (size.height && !size.width) {
        return Promise.reject(
          new ActionError("You must provide a 'size.width' when passing a 'size.height'.")
        );
      }
    }

    if (sessionStore.getScreenRecording()) {
      return Promise.reject(
        new ActionError("Screen recording already in progress.")
      );
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

  getContext() {
    return appiumService.getContext()
      .catch(handleActionError("Failed to get context."));
  }

  getContexts() {
    return appiumService.getContexts()
      .catch(handleActionError("Failed to get contexts."));
  }

  switchContext(contextId) {
    return appiumService.setContext({ contextId })
      .catch(handleActionError(`Failed to set context to '${contextId}'.`));
  }

  switchToWebContext() {
    return appiumService.getContexts()
      .then((contexts) => {
        const [ webContext, ...moreWebContexts ] = contexts.filter((context) => context.id.includes("WEBVIEW"));

        if (!webContext) {
          throw new ActionError("No Web context found.");
        }

        if (moreWebContexts.length) {
          throw new ActionError("Multiple Web contexts found. Consider using the .switchContext method.");
        }

        return appiumService.setContext({ contextId: webContext.id });
      })
      .catch(handleActionError("Failed to switch to the Web context."));
  }

  switchToNativeContext() {
    return appiumService.setContext({ contextId: "NATIVE_APP" })
      .catch(handleActionError("Failed to switch to the native context."));
  }

  execute(script, ...params) {
    const errorMessage = typeof script === "string"
      ? `Failed to execute script '${script}'.`
      : "Failed to execute script.";

    return appiumService.execute({ script, args: params })
      .catch(handleActionError(errorMessage));
  }

  navigate(url) {
    return appiumService.navigate({ url })
      .catch(handleActionError(`Failed to navigate to '${url}'.`));
  }
}

module.exports = {
  Device
};
