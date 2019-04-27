const { get, post } = require("./api");

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
            throw new Error("There was a problem creating a session with the given capabilities.");
          }

          const session = {
            ...data.value,
            sessionId: data.sessionId
          };

          global.session = session;

          return session;
        })
        .then();
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
    attributes: {
      size: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/size`);
      },
      exists: elementExists,
      displayed: (elementId) => {
        return get(`/session/${global.session.sessionId}/element/${elementId}/displayed`);
      }
    },
    actions: {
      click: (elementId) => {
        return post(`/session/${global.session.sessionId}/element/${elementId}/click`);
      }
    }
  },
  interactions: {
    actions: (actions) => {
      return post(`/session/${global.session.sessionId}/actions`, null, {actions});
    }
  }
};