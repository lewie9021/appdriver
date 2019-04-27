const { get, post } = require("./api");
const { getScreenshotSize, getIPhoneScaleFactor } = require("./utils");

// http://appium.io/docs/en/commands/status/
const status = () => {
  return get("/status");
};

// http://appium.io/docs/en/commands/mobile-command/
// TODO: Needs implementing.
const execute = (sessionId, {script, args}) => {
  return Promise.reject("Method not implemented");
};

const createSession = (capabilities) => {
  const payload = {
    desiredCapabilities: capabilities
  };

  return post("/session", null, payload)
    .then((data) => {
      if (data.status !== 0) {
        console.error("capabilities:", capabilities);
        throw new Error("There was a problem creating a session with the given capabilities.");
      }

      return data;
    });
};

const findElement = (sessionId, {using, value}) => {
  return post(`/session/${sessionId}/element`, null, {
    using,
    value
  })
    .then((x) => {
      console.log("findElement response:", x);

      return x;
    });
};

const tapElement = (sessionId, elementId) => {
  return post(`/session/${sessionId}/element/${elementId}/click`);
};

const elementDisplayed = (sessionId, elementId) => {
  console.log("displayed??");

  return get(`/session/${sessionId}/element/${elementId}/displayed`);
};

const takeScreenshot = (sessionId) => {
  return get(`/session/${sessionId}/screenshot`);
};

const elementExists = (matcher) => {
  return matcher.resolve()
    .then((data) => ({
      status: 0,
      value: !data.status,
      sessionId: data.sessionId
    }))
};

const elementSize = (sessionId, elementId) => {
  return get(`/session/${sessionId}/element/${elementId}/size`);
};

// Hack to get viewport size.
// - getScreenshotSize returns width and height in pixels.
const getViewportSize = (sessionId) => {
  return takeScreenshot(sessionId)
    .then(({value}) => {
      const dimensions = getScreenshotSize(value);
      const scaleFactor = getIPhoneScaleFactor("iPhone X"); // TODO: Use session.deviceName.

      return {
        width: dimensions.width / scaleFactor,
        height: dimensions.height / scaleFactor
      };
    });
};

getWindowRect = (sessionId) => {
  return get(`/session/${sessionId}/window/rect`);
};

executeActions = (sessionId, actions) => {
  return post(`/session/${sessionId}/actions`, null, {actions});
};

module.exports = {
  status,
  execute,
  session: {
    create: createSession,
    takeScreenshot,
    getWindowRect,
    executeActions
  },
  device: {
    getViewportSize
  },
  element: {
    findElement,
    attributes: {
      size: elementSize,
      exists: elementExists,
      displayed: elementDisplayed
    },
    actions: {
      tap: tapElement
    }
  }
};