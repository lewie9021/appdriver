const { sessionStore } = require("../stores/sessionStore");
const gestures = require("../gestures");
const matchers = require("../matchers");
const { AppiumError, NotImplementedError, NotSupportedError } = require("../errors");
const { isNativeTextInput, isNativeSwitch, isNativeSlider } = require("../helpers/elementTypes");
const { platform, isPlatform, isInstanceOf, isString, toBoolean, toNumber } = require("../../utils");
const { transformBounds } = require("../attributeTransforms");
const { request } = require("./request");

const parseValue = (rawValue, elementType, options) => {
  switch (elementType) {
    case "XCUIElementTypeTextField":
      return rawValue || "";
    case "XCUIElementTypeSwitch":
      return rawValue === "1";
    case "android.widget.Switch":
      return rawValue === "ON";
    case "XCUIElementTypeSlider":
      if (!options || !options.sliderRange) {
        throw new Error("You must provide a 'sliderRange' option to retrieve slider values.");
      }

      return ((options.sliderRange[1] - options.sliderRange[0]) * parseFloat(rawValue.replace("%", ""))) / 100;
    case "android.widget.SeekBar":
      return parseFloat(rawValue);
    default:
      return rawValue;
  }
};

function createAppiumService() {
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
          capabilities: data.capabilities,
          webContext: Boolean(data.capabilities.autoWebview)
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
  const resetApp = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    if (sessionStore.getCapabilities("noReset")) {
      return Promise.reject(new Error("Unable to reset app when capabilities.noReset is enabled."));
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

  // ({ sessionId: String? }) => Promise<String>.
  const getContextId = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/context`
    });
  };

  // ({ sessionId: String? }) => Promise<Array<{ id: String, title: String | null, url: String | null }>>.
  // Note: Contexts are objects when capabilities.fullContextList is true (iOS only), otherwise they're strings.
  const getContexts = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/contexts`
    })
      .then((contexts) => contexts.map((context) => {
        if (typeof context === "string") {
          return {
            id: context,
            title: null,
            url: null
          };
        }

        return {
          id: context.id,
          title: isString(context.title) ? context.title : null,
          url: isString(context.url) ? context.url : null
        };
      }));
  };

  // ({ sessionId: String? }) => Promise<AppiumElement | null>.
  const getActiveElement = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/element/active`
    })
      .catch((err) => {
        // Handle case when no active element is found.
        if (err.status === 7) {
          return null;
        }

        throw err;
      });
  };

  // ({ sessionId: String? }) => Promise<{ id: String, title: String | null, url: String | null }>.
  const getContext = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return Promise.all([
      getContextId({ sessionId }),
      getContexts({ sessionId })
    ])
      .then(([ contextId, contexts ]) => {
        const context = contexts.find((x) => x.id === contextId);

        if (!context) {
          return {
            id: contextId,
            title: null,
            url: null
          };
        }

        return context;
      });
  };

  // ({ sessionId: String?, contextId: String? }) => Promise.
  const setContext = ({ sessionId = sessionStore.getSessionId(), contextId }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/context`,
      payload: { name: contextId }
    })
      .then(() => sessionStore.setState({ webContext: contextId !== "NATIVE_APP" }));
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
    return platform.select({
      native: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/appium/device/hide_keyboard`
        });
      },
      web: () => {
        // TODO. Seems to press the enter button on iOS...
        return Promise.reject(new NotSupportedError());
      }
    });
  };

  // ({ sessionId: String?, keycode: Number }) => Promise.
  const sendKeyCode = ({ sessionId = sessionStore.getSessionId(), keycode }) => {
    return platform.select({
      ios: () => Promise.reject(new NotImplementedError()),
      android: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/appium/device/press_keycode`,
          payload: { keycode }
        });
      },
      // TODO: Investigate on Android.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String? }) => Promise.
  const goBack = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return platform.select({
      ios: () => Promise.reject(new NotSupportedError()),
      android: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/back`
        });
      },
      web: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/back`
        });
      }
    });
  };

  // ({ sessionId: String?, actions: W3CActions }) => Promise.
  const performActions = ({ sessionId = sessionStore.getSessionId(), actions }) => {
    return platform.select({
      native: () => {
        return request({
          method: "POST",
          path: `/session/${sessionId}/actions`,
          payload: { actions }
        });
      },
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String?, matcher: Matcher, element?: AppiumElement }) => Promise<AppiumElement>.
  const findElement = ({ sessionId = sessionStore.getSessionId(), matcher, element }) => {
    if (element) {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/element`,
        payload: matcher.resolve()
      });
    }

    return request({
      method: "POST",
      path: `/session/${sessionId}/element`,
      payload: matcher.resolve()
    });
  };

  // ({ sessionId: String?, matcher: Matcher, element?: AppiumElement }) => Promise<Array<AppiumElement>>.
  const findElements = ({ sessionId = sessionStore.getSessionId(), matcher, element }) => {
    if (element) {
      return request({
        method: "POST",
        path: `/session/${sessionId}/element/${element.ELEMENT}/elements`,
        payload: matcher.resolve()
      });
    }

    return request({
      method: "POST",
      path: `/session/${sessionId}/elements`,
      payload: matcher.resolve()
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
      ],
      web: () => {
        // TODO: Investigate valid attributes.
        return Promise.reject(new NotSupportedError());
      }
    });
    const attributeMatch = validAttributes.find((x) => x.name === attribute);

    if (!attributeMatch) {
      const attributesText = validAttributes.map((x) => `- ${x.name}`).join("\n");

      throw new Error(`Invalid attribute.\n\nValid attributes are:\n\n${attributesText}`);
    }

    const attributeName = attributeMatch.internalName || attributeMatch.name;

    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/attribute/${attributeName}`
    })
      .then(attributeMatch.transform);
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  const getElementFocusedAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => {
        return getActiveElement({ sessionId })
          .then((ref) => (ref && ref.ELEMENT) === element.ELEMENT);
      },
      android: () => {
        return getElementAttribute({ sessionId, element, attribute: "focused" });
      },
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  // Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
  const getElementSelectedAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      native: () => {
        return request({
          method: "GET",
          path: `/session/${sessionId}/element/${element.ELEMENT}/selected`
        });
      },
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  const getElementEnabledAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      native: () => {
        return request({
          method: "GET",
          path: `/session/${sessionId}/element/${element.ELEMENT}/enabled`
        });
      },
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<Boolean>.
  const getElementVisibleAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      native: () => {
        return request({
          method: "GET",
          path: `/session/${sessionId}/element/${element.ELEMENT}/displayed`
        });
      },
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
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
    return platform.select({
      native: () => {
        return request({
          method: "GET",
          path: `/session/${sessionId}/element/${element.ELEMENT}/name`
        });
      },
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String??, element: AppiumElement }) => Promise<String>.
  const getElementTypeAttribute = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => getElementNameAttribute({ sessionId, element }),
      android: () => getElementAttribute({ sessionId, element, attribute: "className" }),
      // TODO: Needs investigation.
      web: () => Promise.reject(new NotSupportedError())
    });
  };

  // ({ sessionId: String?, matcher: Matcher })
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
      return getElementTextAttribute({ sessionId, element });
    }

    return platform.select({
      ios: () => {
        return getElementTypeAttribute({ sessionId, element })
          .then((type) => {
            return getElementTextAttribute({ sessionId, element })
              .then((text) => {
                if (text || type === "XCUIElementTypeStaticText") {
                  return text;
                }

                const matcher = matchers.iosPredicate(`type == "XCUIElementTypeStaticText"`);

                return findElements({ sessionId, element, matcher })
                  .then((refs) => {
                    const tasks = refs.map((ref) => getElementTextAttribute({ sessionId, element: ref }));

                    return Promise.all(tasks)
                      .then((textFragments) => textFragments.join(" "));
                  });
              });
          });
      },
      android: () => {
        return getElementTypeAttribute({ sessionId, element })
          .then((type) => {
            if (type === "android.widget.TextView") {
              return getElementTextAttribute({ sessionId, element });
            }

            const matcher = matchers.type("android.widget.TextView");

            return findElements({ sessionId, element, matcher })
              .then((refs) => {
                const tasks = refs.map((ref) => getElementTextAttribute({ sessionId, element: ref }));

                return Promise.all(tasks)
                  .then((textFragments) => textFragments.join(" "));
              });
          });
      },
      web: () => {
        // TODO.
        return Promise.reject(new NotSupportedError());
      }
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
      },
      web: () => {
        // TODO.
        return Promise.reject(new NotSupportedError());
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
  const getElementLocation = async ({ sessionId = sessionStore.getSessionId(), element, relative }) => {
    const location = await request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/${relative ? "location_in_view" : "location"}`
    });

    return {
      x: location.x,
      y: location.y
    };
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const clickElement = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/element/${element.ELEMENT}/click`
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number, y: Number }) => Promise.
  const tapElement = ({ sessionId = sessionStore.getSessionId(), element, x, y }) => {
    if (x === 0 && y === 0) {
      return clickElement({ sessionId, element });
    }

    return platform.select({
      native: async () => {
        const location = await getElementLocation({ sessionId, element, relative: true });
        const gesture = gestures.tap({
          x: location.x + x,
          y: location.y + y
        });

        return performActions({
          sessionId,
          actions: await gesture.resolve()
        });
      },
      web: () => {
        return Promise.reject(
          new NotSupportedError("Tap with 'x' and 'y' parameters is not supported in a Web context.")
        );
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const doubleClickElement = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return performActions({
      sessionId,
      actions: [{
        id: "finger1",
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: [
          { type: "pointerMove", duration: 0, origin: { element: element.ELEMENT }, x: 0, y: 0 },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerUp", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerMove", duration: 0, origin: { element: element.ELEMENT }, x: 0, y: 0 },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerUp", button: 0 }
        ]
      }]
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number, y: Number }) => Promise.
  const doubleTapElement = ({ sessionId = sessionStore.getSessionId(), element, x, y }) => {
    return platform.select({
      native: async () => {
        if (x === 0 && y === 0) {
          return doubleClickElement({ sessionId, element });
        }

        const location = await getElementLocation({ sessionId, element, relative: true });
        const gesture = gestures.doubleTap({
          x: location.x + x,
          y: location.y + y
        });

        return performActions({
          sessionId,
          actions: await gesture.resolve()
        });
      },
      web: () => {
        return Promise.reject(new NotSupportedError("Double tap is not supported in a Web context."));
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const longClickElement = ({ sessionId = sessionStore.getSessionId(), element, duration = 750 }) => {
    return performActions({
      sessionId,
      actions: [{
        id: "finger1",
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: [
          { type: "pointerMove", duration: 0, origin: { element: element.ELEMENT }, x: 0, y: 0 },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration },
          { type: "pointerUp", button: 0 }
        ]
      }]
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number, y: Number, duration: Number? }) => Promise.
  const longPressElement = ({ sessionId = sessionStore.getSessionId(), element, x, y, duration = 750 }) => {
    return platform.select({
      native: async () => {
        if (x === 0 && y === 0) {
          return longClickElement({ sessionId, element, duration });
        }

        const location = await getElementLocation({ sessionId, element, relative: true });
        const gesture = gestures.longPress({
          x: location.x + x,
          y: location.y + y,
          duration
        });

        return performActions({
          sessionId,
          actions: await gesture.resolve()
        });
      },
      web: () => {
        return Promise.reject(new NotSupportedError("Long press is not supported in a Web context."));
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement, x: Number, y: Number, distance: Number, direction: Number, duration: Number }) => Promise.
  const swipeElement = ({ sessionId = sessionStore.getSessionId(), element, x, y, distance, direction, duration }) => {
    return platform.select({
      native: async () => {
        const location = await getElementLocation({ sessionId, element, relative: true });
        const gesture = gestures.swipe({
          x: location.x + x,
          y: location.y + y,
          distance,
          direction,
          duration
        });

        return performActions({
          sessionId,
          actions: await gesture.resolve()
        });
      },
      web: () => {
        return Promise.reject(new NotSupportedError("Swipe gestures are not supported in a Web context."));
      }
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

  // ({ sessionId: String?, element: AppiumElement, value: Any, options?: Object }) => Promise.
  const setElementValue = ({ sessionId = sessionStore.getSessionId(), element, value, options = {} }) => {
    return platform.select({
      native: async () => {
        const type = await getElementTypeAttribute({ sessionId, element });

        if (isNativeSwitch(type)) {
          throw new NotSupportedError();
        }

        if (isNativeTextInput(type)) {
          await clearElementText({ sessionId, element });
        }

        if (isNativeSlider(type)) {
          if (!options || !options.sliderRange) {
            throw new Error("You must provide a 'sliderRange' option to set slider values.");
          }

          if (isPlatform("iOS")) {
            const keys = value / (options.sliderRange[1] - options.sliderRange[0]);
            return sendElementKeys({ sessionId, element, keys: keys.toString().split("") });
          }
        }

        return sendElementKeys({ sessionId, element, keys: value.toString().split("") });
      },
      web: () => {
        return clearElementText({ sessionId, element })
          .then(() => sendElementKeys({ sessionId, element, keys: value.toString().split("") }));
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement, text: String }) => Promise.
  const typeElementText = ({ sessionId = sessionStore.getSessionId(), element, text }) => {
    const characters = text.split("");

    if (!isPlatform("Android")) {
      return sendElementKeys({ sessionId, element, keys: characters });
    }

    return performActions({
      sessionId,
      actions: [{
        id: "keyboard",
        type: "key",
        actions: characters.reduce((result, char) => {
          result.push({ type: "keyDown", value: char });
          result.push({ type: "keyUp", value: char });

          return result;
        }, [])
      }]
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const tapElementReturnKey = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => sendElementKeys({ sessionId, element, keys: ["\n"] }),
      android: () => sendKeyCode({ sessionId, keycode: 66 }),
      web: () => {
        // TODO. Doesn't seem to do anything.
        return Promise.reject(new NotSupportedError());
      }
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise.
  const tapElementBackspaceKey = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return platform.select({
      ios: () => sendElementKeys({ sessionId, element, keys: ["\b"] }),
      android: () => sendKeyCode({ sessionId, keycode: 67 }),
      web: () => sendElementKeys({ sessionId, element, keys: ["\b"] })
    });
  };

  // ({ sessionId: String?, element: AppiumElement }) => Promise<String>.
  const takeElementScreenshot = ({ sessionId = sessionStore.getSessionId(), element }) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/element/${element.ELEMENT}/screenshot`
    });
  };

  // ({ sessionId: String? }) => Promise<String>.
  const getAlertText = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
  };

  // ({ sessionId: String? }) => Promise.
  // Note: Seems to accept all present alerts, not just the top one (overlap scenario).
  // If this becomes an issue, we can always write our own heuristic.
  const acceptAlert = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/alert/accept`
    });
  };

  // ({ sessionId: String? }) => Promise.
  // Note: Seems to dismiss all present alerts, not just the top one (overlap scenario).
  // If this becomes an issue, we can always write our own heuristic.
  const dismissAlert = ({ sessionId = sessionStore.getSessionId() } = {}) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/alert/dismiss`
    });
  };

  // ({ sessionId: String? }) => Promise.
  const setAlertValue = ({ sessionId = sessionStore.getSessionId(), value }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/alert/text`,
      payload: { text: value }
    });
  };

  // ({ sessionId: String?, text: String? }) => Promise<Boolean>.
  const getAlertVisible = ({ sessionId = sessionStore.getSessionId(), text } = {}) => {
    return getAlertText({ sessionId })
      .then((alertText) => {
        if (!text) {
          return true;
        }

        return alertText === text;
      })
      .catch((err) => {
        if (isInstanceOf(err, AppiumError) && err.status === 27) {
          return false;
        }

        throw err;
      });
  };

  // ({ sessionId: String?, script: String, args?: Array<String> }) => Promise.
  const execute = ({ sessionId = sessionStore.getSessionId(), script, args = [] }) => {
    return request({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: { script, args }
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
    getContext,
    getContexts,
    setContext,
    getViewport,
    getOrientation,
    setOrientation,
    takeScreenshot,
    startScreenRecording,
    stopScreenRecording,
    getKeyboardVisible,
    hideKeyboard,
    sendKeyCode,
    goBack,
    performActions,

    findElement,
    findElements,
    getElementAttribute,
    getElementFocusedAttribute,
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
    doubleTapElement,
    longPressElement,
    swipeElement,
    sendElementKeys,
    setElementValue,
    typeElementText,
    clearElementText,
    tapElementReturnKey,
    tapElementBackspaceKey,
    takeElementScreenshot,

    getAlertText,
    acceptAlert,
    dismissAlert,
    setAlertValue,
    getAlertVisible,

    execute
  };
}

module.exports = {
  createAppiumService,
  appiumService: createAppiumService()
};
