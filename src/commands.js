const { get, post, del } = require("./api");

global.session = null;

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

          const session = {
            ...data.value,
            sessionId: data.sessionId
          };

          global.session = session;

          return session;
        });
    },
    end: (sessionId) => {
      return del(`/session/${sessionId}`)
        .then(({status}) => {
          if (status) {
            throw new Error("There was a problem ending the session.");
          }
        });
    },
    takeScreenshot: () => {
      return get(`/session/${global.session.sessionId}/screenshot`);
    },
    getWindowRect: () => {
      return get(`/session/${global.session.sessionId}/window/rect`);
    },
    getOrientation: () => {
      return get(`/session/${global.session.sessionId}/orientation`);
    },
    setOrientation: (orientation) => {
      const payload = {
        orientation
      };

      return post(`/session/${global.session.sessionId}/orientation`, null, payload);
    }
  },
  device: {
    app: {
      closeApp: () => {
        return post(`/session/${global.session.sessionId}/appium/app/close`);
      },
      launchApp: () => {
        return post(`/session/${global.session.sessionId}/appium/app/launch`);
      },
      resetApp: () => {
        return post(`/session/${global.session.sessionId}/appium/app/reset`);
      }
    }
  },
  element: {
    findElement: ({using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${global.session.sessionId}/element`, null, payload);
    },
    findElements: ({using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${global.session.sessionId}/elements`, null, payload);
    },
    findElementsFromElement: (elementId, {using, value}) => {
      const payload = {
        using,
        value
      };

      return post(`/session/${global.session.sessionId}/element/${elementId}/elements`, null, payload);
    },
    attributes: {
      size: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/size`);
      },
      text: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/text`);
      },
      value: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/attribute/value`);
      },
      className: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/attribute/className`);
      },
      exists: elementExists,
      displayed: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/displayed`);
      },
      location: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/location`);
      },
      locationInView: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/location_in_view`);
      },
      replaceValue: (elementId) => {
        return post(`/session/${global.session.sessionId}/element/${elementId}/replace_value`);
      }
    },
    actions: {
      click: (elementId) => {
        return post(`/session/${global.session.sessionId}/element/${elementId}/click`);
      },
      sendKeys: (elementId, value) => {
        const payload = {
          value
        };

        return post(`/session/${global.session.sessionId}/element/${elementId}/value`, null, payload);
      },
      clear: (elementId) => {
        return post(`/session/${global.session.sessionId}/element/${elementId}/clear`);
      }
    }
  },
  interactions: {
    actions: (actions) => {
      return post(`/session/${global.session.sessionId}/actions`, null, {actions});
    }
  }
};