const { get, post, del } = require("./appium/api");
const { platform } = require("./utils");
const { ElementNotFoundError, ElementsNotFoundError, ElementActionError, NotImplementedError } = require("./errors");
const { getSession, setSession } = require("./session");

const elementExists = (matcher) => {
  return matcher.resolve()
    .then((data) => ({
      status: 0,
      value: !data.status,
      sessionId: data.sessionId
    }))
};

// Official Appium routes:
// https://github.com/appium/appium-base-driver/blob/master/lib/protocol/routes.js

module.exports = {
  // http://appium.io/docs/en/commands/status/
  status: () => {
    return get("/status");
  },
  session: {
    create: (capabilities) => {
      const payload = {
        desiredCapabilities: capabilities
      };

      return post("/session", null, payload)
        .then((data) => {
          if (data.status !== 0) {
            console.error(data.value.message);
            throw new Error("There was a problem creating a session with the given capabilities.");
          }

          return setSession({
            ...data.value,
            sessionId: data.sessionId
          });
        });
    },
    end: (sessionId) => {
      return del(`/session/${sessionId}`)
        .then(({status}) => {
          if (status) {
            throw new Error("There was a problem ending the session.");
          }

          setSession(null);
        });
    },
    takeScreenshot: () => {
      return get(`/session/${getSession("sessionId")}/screenshot`);
    },
    getWindowRect: () => {
      return get(`/session/${getSession("sessionId")}/window/rect`);
    },
    getOrientation: () => {
      return get(`/session/${getSession("sessionId")}/orientation`)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to get device orientation.");
          }

          return value;
        });
    },
    setOrientation: (orientation) => {
      const payload = {
        orientation
      };

      return post(`/session/${getSession("sessionId")}/orientation`, null, payload)
        .then(({status}) => {
          if (status) {
            throw new Error("Failed to set device orientation.");
          }
        });
    }
  },
  device: {
    takeScreenshot: () => {
      return get(`/session/${getSession("sessionId")}/screenshot`)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to take screenshot.");
          }

          return value;
        });
    },
    startScreenRecording: (payload) => {
      return post(`/session/${getSession("sessionId")}/appium/start_recording_screen`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to start screen recording.");
          }

          return value;
        });
    },
    stopScreenRecording: () => {
      return post(`/session/${getSession("sessionId")}/appium/stop_recording_screen`)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to stop screen recording.");
          }

          return value;
        });
    },
    hideKeyboard: () => {
      return post(`/session/${getSession("sessionId")}/appium/device/hide_keyboard`)
        .then(({status}) => {
          if (status) {
            throw new Error("Failed to hide keyboard.");
          }
        });
    },
    isKeyboardShown: () => {
      return get(`/session/${getSession("sessionId")}/appium/device/is_keyboard_shown`)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to get keyboard visibility status.");
          }

          return value;
        });
    },
    back: () => {
      if (getSession("platformName") === "iOS") {
        return Promise.reject(new NotImplementedError());
      }

      return post(`/session/${getSession("sessionId")}/back`)
        .then(({status}) => {
          if (status) {
            throw new Error("Failed to go back.");
          }
        });
    },
    app: {
      closeApp: () => {
        return post(`/session/${getSession("sessionId")}/appium/app/close`);
      },
      launchApp: () => {
        return post(`/session/${getSession("sessionId")}/appium/app/launch`);
      },
      resetApp: () => {
        return post(`/session/${getSession("sessionId")}/appium/app/reset`);
      }
    }
  },
  element: {
    findElement: ({using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/element`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new ElementNotFoundError("Failed to find element.");
          }

          return value.ELEMENT;
        });
    },
    findElementFromElement: (elementId, {using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/element/${elementId}/element`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new ElementNotFoundError("Failed to find element from element.");
          }

          return value.ELEMENT;
        })
    },
    findElements: ({using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/elements`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new ElementsNotFoundError("Failed to find elements.");
          }

          return value.map((element) => element.ELEMENT);
        });
    },
    findElementsFromElement: (elementId, {using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/element/${elementId}/elements`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new ElementsNotFoundError("Failed to find elements from element.");
          }

          return value.map((element) => element.ELEMENT);
        })
    },
    attributes: {
      attribute: (elementId, name, displayName) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/attribute/${name}`)
          .then(({status, value}) => {
            if (status) {
              throw new Error(`Failed to get '${displayName || name}' attribute of element.`);
            }

            return value;
          });
      },
      size: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/size`)
          .then(({status, value}) => {
            if (status) {
              throw new Error("Failed to get element size.");
            }

            return value;
          });
      },
      // Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
      selected: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/selected`)
          .then(({status, value}) => {
            if (status) {
              throw new Error("Failed to get element selected status.");
            }

            return value;
          });
      },
      disabled: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/enabled`)
          .then(({status, value}) => {
            if (status) {
              throw new Error("Failed to retrieve disabled status of element.");
            }

            return !value;
          });
      },
      text: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/text`)
          .then(({status, value}) => {
            if (status) {
              throw new Error("Failed to get element text.");
            }

            return value;
          });
      },
      value: (elementId) => {
        const spec = {
          ios: () => get(`/session/${getSession("sessionId")}/element/${elementId}/attribute/value`),
          android: () => get(`/session/${getSession("sessionId")}/element/${elementId}/text`)
        };

        return platform.select(spec);
      },
      type: (elementId) => {
        const spec = {
          ios: () => get(`/session/${getSession("sessionId")}/element/${elementId}/name`),
          android: () => get(`/session/${getSession("sessionId")}/element/${elementId}/attribute/className`)
        };

        return platform.select(spec)
          .then(({status, value}) => {
            if (status) {
              if (status === 3) {
                throw new ElementNotFoundError("Failed to get element type.");
              }

              throw new Error("Failed to get element type.");
            }

            return value;
          });
      },
      name: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/name`);
      },
      exists: elementExists,
      displayed: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/displayed`)
          .then(({status, value}) => {
            if (status) {
              throw new Error("Failed to get element visibility status.");
            }

            return value;
          });
      },
      location: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/location`)
          .then(({status, value}) => {
            if (status) {
              throw new ElementActionError("Failed to get element location.");
            }

            return value;
          });
      },
      locationInView: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/location_in_view`)
          .then(({status, value}) => {
            if (status) {
              throw new ElementActionError("Failed to get element relative location.");
            }

            return value;
          });
      }
    },
    actions: {
      sendKeys: (elementId, value) => {
        const payload = {
          value
        };

        return post(`/session/${getSession("sessionId")}/element/${elementId}/value`, null, payload)
          .then(({status}) => {
            if (status === 13 && getSession("platformName") === "iOS") {
              throw new ElementActionError("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator.");
            }

            if (status) {
              throw new ElementActionError("Failed to type text.");
            }
          });
      },
      clear: (elementId) => {
        return post(`/session/${getSession("sessionId")}/element/${elementId}/clear`)
          .then(({status}) => {
            if (status) {
              throw new ElementActionError("Failed to clear text.");
            }
          });
      }
    }
  },
  interactions: {
    actions: (actions) => {
      return post(`/session/${getSession("sessionId")}/actions`, null, {actions});
    }
  }
};