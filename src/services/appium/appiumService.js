const fetch = require("node-fetch").default;
const { configService } = require("../config/configService");
const { AppiumError } = require("../../errors");
const { NotImplementedError } = require("../../errors");
const { platform } = require("../../utils");

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

function createAppiumService() {
  let session = {
    sessionId: null,
    capabilities: null
  };

  return {
    // () => Promise<Object>.
    getStatus: () => {
      return request({
        method: "GET",
        path: "/status"
      });
    },

    // ({ desiredCapabilities: AppiumCapability }) => Promise<AppiumCapability>.
    createSession: ({ desiredCapabilities }) => {
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
        .then((data) => session = data);
    },

    // ({ sessionId: String? }) => Promise.
    endSession: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "DELETE",
        path: `/session/${sessionId}`
      });
    },

    // ({ sessionId: String? }) => Promise.
    launchApp: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/app/launch`
      });
    },

    // ({ sessionId: String? }) => Promise.
    closeApp: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/app/close`
      });
    },

    // ({ sessionId: String? }) => Promise.
    resetApp: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/app/reset`
      });
    },

    // ({ sessionId: String? }) => Promise<{ width: Number, height: Number }>.
    getViewport: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/window/rect`
      });
    },

    // ({ sessionId: String? }) => Promise<String>.
    getOrientation: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/orientation`
      });
    },

    // ({ sessionId: String?, orientation: String }) => Promise.
    setOrientation: ({ sessionId = session.sessionId, orientation }) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/orientation`,
        payload: { orientation }
      });
    },

    // ({ sessionId: String? }) => Promise<String>.
    takeScreenshot: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/screenshot`
      });
    },

    // ({ sessionId: String?, ...options: Object }) => Promise.
    startScreenRecording: ({ sessionId = session.sessionId, ...options }) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/start_recording_screen`,
        payload: options
      });
    },

    // ({ sessionId: String? }) => Promise<String>.
    stopScreenRecording: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/stop_recording_screen`
      });
    },

    // ({ sessionId: String? }) => Promise<Boolean>.
    getKeyboardVisible: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/appium/device/is_keyboard_shown`
      });
    },

    // ({ sessionId: String? }) => Promise.
    hideKeyboard: ({ sessionId = session.sessionId } = {}) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/appium/device/hide_keyboard`
      });
    },

    // ({ sessionId: String? }) => Promise.
    goBack: ({ sessionId = session.sessionId } = {}) => {
      return platform.select({
        ios: () => Promise.reject(new NotImplementedError()),
        android: () => {
          return request({
            method: "POST",
            path: `/session/${sessionId}/back`
          });
        }
      });
    },

    // ({ sessionId: String?, actions: W3CActions }) => Promise.
    performActions: ({ sessionId = session.sessionId, actions }) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/actions`,
        payload: { actions }
      });
    },

    // ({ sessionId: String?, matcher: AppiumMatcher, element: AppiumElement }) => Promise<AppiumElement>.
    findElement: ({ sessionId = session.sessionId, matcher, element }) => {
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
    },

    // ({ sessionId: String?, matcher: AppiumMatcher, element: AppiumElement }) => Promise<Array<AppiumElement>>.
    findElements: ({ sessionId = session.sessionId, matcher, element }) => {
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
    },

    // ({ sessionId: String?, element: AppiumElement, attribute: String }) => Promise<String>.
    getElementAttribute: ({ sessionId = session.sessionId, element, attribute }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/attribute/${attribute}`
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
    // Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
    getElementSelected: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/selected`
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
    getElementDisabled: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/enabled`
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
    getElementVisible: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/displayed`
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<{ width: Number, height: Number }>.
    getElementSize: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/size`
      });
    },

    // ({ sessionId: String??, element: AppiumElement }) => Promise<String>.
    getElementName: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/name`
      });
    },

    // ({ sessionId: String??, element: AppiumElement }) => Promise<String>.
    getElementType: ({ sessionId = session.sessionId, element }) => {
      return platform.select({
        ios: () => getElementName({ sessionId, element }),
        android: () => getElementAttribute({ sessionId, element, attribute: "className" })
      });
    },

    // ({ sessionId: String?, matcher: AppiumMatcher })
    getElementExists: ({ sessionId = session.sessionId, matcher }) => {
      return findElement({ sessionId, matcher })
        .then(() => true)
        .catch(() => false);
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
    getElementText: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "GET",
        path: `/session/${sessionId}/element/${element.ELEMENT}/text`
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
    getElementValue: ({ sessionId = session.sessionId, element }) => {
      return platform.select({
        ios: () => getElementAttribute({ sessionId, element, attribute: "value" }),
        android: () => getElementText({ sessionId, element })
      });
    },

    // ({ sessionId: String?, element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
    getElementLocation: ({ sessionId = session.sessionId, element, relative }) => {
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
    },

    // ({ sessionId: String?, element: AppiumElement, text: String }) => Promise.
    // Note: status of 13 means hardware keyboard needs to be disconnected.
    sendElementText: ({ sessionId = session.sessionId, element, text }) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/value`,
        payload: { value: text }
      });
    },

    // ({ sessionId: String?, element: AppiumElement }) => Promise.
    clearElementText: ({ sessionId = session.sessionId, element }) => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/clear`
      });
    },
  };
}

module.exports = {
  createAppiumService,
  appiumService: createAppiumService()
};