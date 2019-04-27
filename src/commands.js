const { get, post } = require("./api");

global.session = null;

// http://appium.io/docs/en/commands/status/
const status = () => {
  return get("/status");
};

// http://appium.io/docs/en/commands/mobile-command/
// TODO: Needs implementing.
const execute = ({script, args}) => {
  return Promise.reject("Method not implemented");
};

const findElement = ({using, value}) => {
  return post(`/session/${global.session.sessionId}/element`, null, {
    using,
    value
  })
    .then((x) => {
      console.log("findElement response:", x);

      return x;
    });
};

const tapElement = (elementId) => {
  return post(`/session/${global.session.sessionId}/element/${elementId}/click`);
};

const elementDisplayed = (elementId) => {
  return get(`/session/${global.session.sessionId}/element/${elementId}/displayed`);
};

const takeScreenshot = () => {
  return get(`/session/${global.session.sessionId}/screenshot`);
};

const elementExists = (matcher) => {
  return matcher.resolve()
    .then((data) => ({
      status: 0,
      value: !data.status,
      sessionId: data.sessionId
    }))
};

const elementSize = (elementId) => {
  return get(`/session/${global.session.sessionId}/element/${elementId}/size`);
};

getWindowRect = () => {
  return get(`/session/${global.session.sessionId}/window/rect`);
};

executeActions = (actions) => {
  return post(`/session/${global.session.sessionId}/actions`, null, {actions});
};

module.exports = {
  status,
  execute,
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
    takeScreenshot,
    getWindowRect,
    executeActions
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