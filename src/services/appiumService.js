const fetch = require("node-fetch").default;
const { configService } = require("./configService");
const { AppiumError } = require("../errors");
const { NotImplementedError } = require("../errors");
const { platform, isInstanceOf } = require("../utils");

const BASE_URL = configService.getBaseUrl();

const qs = (params) => {
  if (!params) {
    return "";
  }

  const pairs = Object.keys(params)
    .reduce((result, key) => {
      const value = params[key];

      if (value === null || typeof value === "undefined") {
        return result;
      }

      return result.concat(`${key}=${encodeURIComponent(value)}`);
    }, []);

  if (!pairs.length) {
    return "";
  }

  return "?" + pairs.join("&");
};

const request = ({ method, path, query, payload, transform }) => {
  const queryString = qs(query);
  const opts = {
    method: method,
    body: payload
      ? JSON.stringify(payload)
      : undefined,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return fetch(`${BASE_URL}${path}${queryString}`, opts)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        throw new AppiumError(data.value.message, data.status);
      }

      return transform
        ? transform(data)
        : data.value;
    });
};

function createAppiumService(sessionStore) {
  // () => Promise<Object>.
  const getStatus = () => {
    return request({
      method: "GET",
      path: "/status"
    });
  };

  // ({ desiredCapabilities: AppiumCapability }) => Promise<AppiumCapability>.
  const createSession = ({ desiredCapabilities }) => {
    const params = {
      method: "POST",
      path: "/session",
      payload: { desiredCapabilities },
      transform: (data) => ({
        sessionId: data.sessionId,
        capabilities: data.value
      })
    };

    return request(params)
      .then((data) => {
        sessionStore.setState({
          sessionId: data.sessionId,
          capabilities: data.capabilities
        });

        return data;
      });
  };

  // ({ sessionId: String? }) => Promise.
  const endSession = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    const params = {
      method: "DELETE",
      path: `/session/${sessionId}`
    };

    return request(params)
      .then(sessionStore.reset);
  };

  // ({ sessionId: String? }) => Promise.
  const launchApp = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/app/launch`
    });
  };

  // ({ sessionId: String? }) => Promise.
  const closeApp = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/app/close`
    });
  };

  // ({ sessionId: String? }) => Promise.
  const resetApp = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/app/reset`
    });
  };

  // ({ sessionId: String? }) => Promise<{ width: Number, height: Number }>.
  const getViewport = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/window/rect`
    });
  };

  // ({ sessionId: String? }) => Promise<String>.
  const getOrientation = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/orientation`
    });
  };

  // ({ sessionId: String?, orientation: String }) => Promise.
  const setOrientation = ({ sessionId = sessionStore.getSessionId(), orientation }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/orientation`,
      payload: { orientation }
    });
  };

  // ({ sessionId: String? }) => Promise<String>.
  const takeScreenshot = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/screenshot`
    });
  };

  // ({ sessionId: String?, options: Object }) => Promise.
  const startScreenRecording = ({ sessionId = sessionStore.getSessionId(), options }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/start_recording_screen`,
      payload: options
    });
  };

  // ({ sessionId: String? }) => Promise<String>.
  const stopScreenRecording = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/stop_recording_screen`
    });
  };

  // ({ sessionId: String? }) => Promise<Boolean>.
  const getKeyboardVisible = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/appium/device/is_keyboard_shown`
    });
  };

  // ({ sessionId: String? }) => Promise.
  const hideKeyboard = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/device/hide_keyboard`
    });
  };

  // ({ sessionId: String? }) => Promise.
  const goBack = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return platform.select({
      ios: () => Promise.reject(new NotImplementedError()),
      android: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/back`
        });
      }
    });
  };

  // ({ sessionId: String?, actions: W3CActions }) => Promise.
  const performActions = ({ sessionId = sessionStore.getSessionId(), actions }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/actions`,
      payload: { actions }
    });
  };

  // ({ sessionId: String?, matcher: AppiumMatcher, element?: AppiumElement }) => Promise<AppiumElement>.
  const findElement = ({ sessionId = sessionStore.getSessionId(), matcher, element }) => {
    if (element) {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/element`,
        payload: matcher
      });
    }

    return request({
      method: "POST",
      path: `/session/${sessionId}/element`,
      payload: matcher
    });
  };

  // ({ sessionId: String?, matcher: AppiumMatcher, element?: AppiumElement }) => Promise<Array<AppiumElement>>.
  const findElements = ({ sessionId = sessionStore.getSessionId(), matcher, element }) => {
    if (element) {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/elements`,
        payload: matcher
      });
    }

    return request({
      method: "POST",
      path: `/session/${sessionId}/elements`,
      payload: matcher
    });
  };

  // ({ sessionId: String?, element: AppiumElement, attribute: String }) => Promise<String>.
  const getElementAttribute = ({ sessionId = sessionStore.getSessionId(), element, attribute }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/attribute/${attribute}`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  // Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
  const getElementSelectedAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/selected`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  const getElementEnabledAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/enabled`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  const getElementVisibleAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/displayed`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<{ width: Number, height: Number }>.
  const getElementSize = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/size`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
  const getElementNameAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/name`
    });
  };

  // ({ sessionId: String??, element: AppiumElement }) => Promise<String>.
  const getElementTypeAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => getElementNameAttribute({ sessionId, element }),
      android: () => getElementAttribute({ sessionId, element, attribute: "className" })
    });
  };

  // ({ sessionId: String?, matcher: AppiumMatcher })
  const getElementExists = ({ sessionId = sessionStore.getSessionId(), matcher }) => {
    return findElement({ sessionId, matcher })
      .then(() => true)
      .catch((err) => {
        // TODO: Maybe we should be more specific. Probably error code 7?
        if (isInstanceOf(err, AppiumError)) {
          return false;
        }

        throw err;
      });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
  const getElementTextAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/text`
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
  const getElementText = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return getElementTypeAttribute({ element })
      .then((type) => {
        return platform.select({
          ios: () => {
            return getElementTextAttribute({ element })
              .then((text) => {
                if (text || type === "XCUIElementTypeStaticText") {
                  return text;
                }

                const matcher = {
                  using: "-ios predicate string",
                  value: `type == "XCUIElementTypeStaticText"`
                };

                return findElements({ element, matcher })
                  .then((refs) => {
                    const tasks = refs.map((ref) => getElementTextAttribute({ element: ref }));

                    return Promise.all(tasks)
                      .then((textFragments) => textFragments.join(" "));
                  });
              });
          },
          android: () => {
            if (type === "android.widget.TextView") {
              return getElementTextAttribute({ element });
            }

            const matcher = {
              using: "class name",
              value: "android.widget.TextView"
            };

            return findElements({ element, matcher })
              .then((refs) => {
                const tasks = refs.map((ref) => getElementTextAttribute({ element: ref }));

                return Promise.all(tasks)
                  .then((textFragments) => textFragments.join(" "));
              });
          }
        });
      });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
  const getElementValue = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => getElementAttribute({ sessionId, element, attribute: "value" }),
      android: () => getElementTextAttribute({ sessionId, element })
    });
  };

  // ({ sessionId: String?, element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
  const getElementLocation = ({ sessionId = sessionStore.getSessionId(), element, relative }) => {
    if (relative) {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/location_in_view`
      });
    }

    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/location`
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number?, y: Number?, duration: Number? }) => Promise.
  const tapElement = ({ sessionId = sessionStore.getSessionId(), element, x = 0, y = 0, duration = 0 }) => {
    return performActions({
      sessionId, actions: [{
        id: "finger1",
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: [
          { type: "pointerMove", duration: 0, origin: { element: element.ELEMENT }, x, y },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration },
          { type: "pointerUp", button: 0 }
        ]
      }]
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number?, y: Number?, duration: Number? }) => Promise.
  const longPressElement = ({ sessionId = sessionStore.getSessionId(), element, x, y, duration = 750 }) => {
    return performActions({
      sessionId, actions: [{
        id: "finger1",
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: [
          { type: "pointerMove", duration: 0, origin: { element: element.ELEMENT }, x, y },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration },
          { type: "pointerUp", button: 0 }
        ]
      }]
    });
  };

  // ({ sessionId: String?, element: AppiumElement, keys: Array<String> }) => Promise.
  const sendElementKeys = ({ sessionId = sessionStore.getSessionId(), element, keys }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/element/${element.ELEMENT}/value`,
      payload: { value: keys }
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const clearElementText = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/element/${element.ELEMENT}/clear`
    });
  };

  return {
    getStatus,
    createSession,
    endSession,
    launchApp,
    closeApp,
    resetApp,
    getViewport,
    getOrientation,
    setOrientation,
    takeScreenshot,
    startScreenRecording,
    stopScreenRecording,
    getKeyboardVisible,
    hideKeyboard,
    goBack,
    performActions,
    findElement,
    findElements,
    getElementAttribute,
    getElementSelectedAttribute,
    getElementEnabledAttribute,
    getElementVisibleAttribute,
    getElementSize,
    getElementNameAttribute,
    getElementTypeAttribute,
    getElementExists,
    getElementText,
    getElementTextAttribute,
    getElementValue,
    getElementLocation,
    tapElement,
    longPressElement,
    sendElementKeys,
    clearElementText
  };
}

module.exports = {
  createAppiumService,
  appiumService: createAppiumService(sessionStore)
};