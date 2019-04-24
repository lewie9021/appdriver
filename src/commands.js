const { get, post } = require("./api");

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
  return post("/session", null, {
    desiredCapabilities: capabilities
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

const elementExists = (matcher) => {
  return matcher.resolve()
    .then((data) => ({
      status: 0,
      value: !data.status,
      sessionId: data.sessionId
    }))
};

module.exports = {
  status,
  execute,
  session: {
    create: createSession
  },
  element: {
    findElement,
    attributes: {
      exists: elementExists,
      displayed: elementDisplayed
    },
    actions: {
      tap: tapElement
    }
  }
};