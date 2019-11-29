const { sessionStore } = require("../stores/sessionStore");
const { AppiumError } = require("../errors");
const { NotImplementedError } = require("../errors");
const { platform, isInstanceOf, getRelativePoint, toBoolean, toNumber } = require("../../utils");
const { transformBounds } = require("../attributeTransforms");
const { request } = require("./request");

const parseValue = (rawValue, elementType, options) => {
  switch (elementType) {
    case "XCUIElementTypeTextField":
      return rawValue || "";
    case "XCUIElementTypeSwitch":
      return rawValue === "1";
    case "XCUIElementTypeButton":
      // Possibly a switch?
      if (rawValue === "1" || rawValue === "0") {
        return Boolean(parseInt(rawValue));
      }

      return rawValue;
    case "android.widget.Switch":
      return rawValue === "ON";
    case "XCUIElementTypeSlider":
      if (!options || !options.sliderRange) {
        throw new Error("You must provide a 'sliderRange' option when dealing with slider elements.");
      }

      return ((options.sliderRange[1] - options.sliderRange[0]) * parseFloat(rawValue.replace("%", ""))) / 100;
    case "android.widget.SeekBar":
      return parseFloat(rawValue);
    default:
      return rawValue;
  }
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

  // ({ sessionId: String?, appId: String }) => Promise.
  const launchApp = ({ sessionId = sessionStore.getSessionId(), appId } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/device/activate_app`,
      payload: { appId }
    });
  };

  // ({ sessionId: String?, appId: String }) => Promise.
  const closeApp = ({ sessionId = sessionStore.getSessionId(), appId } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/device/terminate_app`,
      payload: { appId }
    });
  };

  // ({ sessionId: String? }) => Promise.
  // TODO: Throw if capabilities.noReset is true.
  const resetApp = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    if (sessionStore.getCapabilities("noReset")) {
      return Promise.reject(new Error("Unable to reset app when capabilities.noReset is enabled.'"));
    }

    return request({
      method: "POST",
      path: `/session/${sessionId}/appium/app/reset`
    });
  };

  // ({ sessionId: String?, appId: String? }) => Promise.
  const restartApp = ({ sessionId = sessionStore.getSessionId(), appId = sessionStore.getAppId() } = {}) => {
    return closeApp({ sessionId, appId })
      .then(() => launchApp({ sessionId, appId }));
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

  // ({ sessionId: String?, element: AppiumElement, attribute: String }) => Promise<Boolean | String | Number | Object>.
  const getElementAttribute = ({ sessionId = sessionStore.getSessionId(), element, attribute }) => {
    const validAttributes = platform.select({
      ios: () => [
        { name: "uid", internalName: "UID" },
        { name: "accessibilityContainer", transform: toBoolean },
        { name: "accessible", transform: toBoolean },
        { name: "enabled", transform: toBoolean },
        // { name: "frame" }, // 500 error on ScrollView element.
        { name: "label" },
        { name: "name" },
        { name: "rect", transform: JSON.parse },
        { name: "type" },
        { name: "value" },
        { name: "visible", transform: toBoolean }
      ],
      android: () => [
        { name: "checkable", transform: toBoolean },
        { name: "checked", transform: toBoolean },
        { name: "className" },
        { name: "clickable", transform: toBoolean },
        { name: "contentDescription" },
        { name: "enabled", transform: toBoolean },
        { name: "focusable", transform: toBoolean },
        { name: "focused", transform: toBoolean },
        { name: "longClickable", transform: toBoolean },
        { name: "package" },
        // { name: "password" }, // Doesn't seem to work.
        { name: "resourceId" },
        { name: "scrollable", transform: toBoolean },
        { name: "selectionStart", internalName: "selection-start", transform: toNumber },
        { name: "selectionEnd", internalName: "selection-end", transform: toNumber },
        { name: "selected", transform: toBoolean },
        { name: "text" },
        { name: "bounds", transform: transformBounds },
        { name: "displayed", transform: toBoolean },
        { name: "contentSize", transform: JSON.parse } // Only works on ScrollViews
      ]
    });
    const attributeMatch = validAttributes.find((x) => x.name === attribute);

    if (!attributeMatch) {
      throw new Error(`Invalid attribute.\n\nValid attributes are:\n\n${validAttributes.map((x) => `- ${x.name}`).join("\n")}`);
    }

    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/attribute/${attributeMatch.internalName || attributeMatch.name}`
    })
      .then(attribute.transform)
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

  // ({ sessionId: String?, element: AppiumElement, options? Object }) => Promise<String>.
  const getElementText = ({ sessionId = sessionStore.getSessionId(), element, options = {} }) => {
    if (!options.recursive) {
      return getElementTextAttribute({ sessionId, element })
    }

    return getElementTypeAttribute({ sessionId, element })
      .then((type) => {
        return platform.select({
          ios: () => {
            return getElementTextAttribute({ sessionId, element })
              .then((text) => {
                if (text || type === "XCUIElementTypeStaticText") {
                  return text;
                }

                const matcher = {
                  using: "-ios predicate string",
                  value: `type == "XCUIElementTypeStaticText"`
                };

                return findElements({ sessionId, element, matcher })
                  .then((refs) => {
                    const tasks = refs.map((ref) => getElementTextAttribute({ sessionId, element: ref }));

                    return Promise.all(tasks)
                      .then((textFragments) => textFragments.join(" "));
                  });
              });
          },
          android: () => {
            if (type === "android.widget.TextView") {
              return getElementTextAttribute({ sessionId, element });
            }

            const matcher = {
              using: "class name",
              value: "android.widget.TextView"
            };

            return findElements({ sessionId, element, matcher })
              .then((refs) => {
                const tasks = refs.map((ref) => getElementTextAttribute({ sessionId, element: ref }));

                return Promise.all(tasks)
                  .then((textFragments) => textFragments.join(" "));
              });
          }
        });
      });
  };

  // ({ sessionId: String?, element: AppiumElement, options? Object }) => Promise<Number | Boolean | String>.
  const getElementValue = ({ sessionId = sessionStore.getSessionId(), element, options = {} }) => {
    return platform.select({
      ios: () => {
        const tasks = [
          getElementTypeAttribute({ sessionId, element }),
          getElementAttribute({ sessionId, element, attribute: "value" })
        ];

        return Promise.all(tasks)
          .then(([ type, value ]) => parseValue(value, type, options));
      },
      android: () => {
        const tasks = [
          getElementTypeAttribute({ sessionId, element }),
          getElementTextAttribute({ sessionId, element })
        ];

        return Promise.all(tasks)
          .then(([ type, value ]) => parseValue(value, type, options));
      }
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

  // ({ sessionId: String?, element: AppiumElement, x: Number, y: Number, distance: Number, direction: Number, duration: Number }) => Promise.
  const swipeElement = ({ sessionId = sessionStore.getSessionId(), element, x, y, distance, direction, duration }) => {
    const relativePoint = getRelativePoint({ direction, distance });

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
          { type: "pause", duration: 250 },
          { type: "pointerMove", duration, origin: "pointer", x: relativePoint.x, y: relativePoint.y },
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
    restartApp,
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
    swipeElement,
    sendElementKeys,
    clearElementText
  };
}

module.exports = {
  createAppiumService,
  appiumService: createAppiumService(sessionStore)
};