const { get, post, del } = require("./api");
const { platform } = require("./utils");
const { ElementNotFoundError } = require("./errors");
const { getSession, setSession } = require("./session");

const elementExists = (matcher) => {
  return matcher.resolve()
    .then((data) => ({
      status: 0,
      value: !data.status,
      sessionId: data.sessionId
    }))
};

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
      return get(`/session/${getSession("sessionId")}/orientation`);
    },
    setOrientation: (orientation) => {
      const payload = {
        orientation
      };

      return post(`/session/${getSession("sessionId")}/orientation`, null, payload);
    }
  },
  device: {
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

      return post(`/session/${getSession("sessionId")}/element`, null, payload);
    },
    findElements: ({using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/elements`, null, payload);
    },
    findElementsFromElement: (elementId, {using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${getSession("sessionId")}/element/${elementId}/elements`, null, payload)
        .then(({status, value}) => {
          if (status) {
            throw new Error("Failed to get elements from element.");
          }

          return value;
        })
    },
    attributes: {
      size: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/size`);
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
        return get(`/session/${getSession("sessionId")}/element/${elementId}/location`);
      },
      locationInView: (elementId) => {
        return get(`/session/${getSession("sessionId")}/element/${elementId}/location_in_view`);
      },
      replaceValue: (elementId) => {
        return post(`/session/${getSession("sessionId")}/element/${elementId}/replace_value`);
      }
    },
    actions: {
      click: (elementId) => {
        return post(`/session/${getSession("sessionId")}/element/${elementId}/click`);
      },
      sendKeys: (elementId, value) => {
        const payload = {
          value
        };

        return post(`/session/${getSession("sessionId")}/element/${elementId}/value`, null, payload);
      },
      clear: (elementId) => {
        return post(`/session/${getSession("sessionId")}/element/${elementId}/clear`);
      }
    }
  },
  interactions: {
    actions: (actions) => {
      return post(`/session/${getSession("sessionId")}/actions`, null, {actions});
    }
  }
};