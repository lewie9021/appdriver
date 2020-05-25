const { sessionStore } = require("../../stores/sessionStore");
const { request } = require("../request");
const { platform } = require("../../../utils");
const { NotSupportedError } = require("../../errors");

// (script: Function | String) => String
const getWebScript = (script) => {
  if (typeof script === "function") {
    return `return (${script}).apply(null, arguments)`;
  }

  if (script.trim().startsWith("return")) {
    return script;
  }

  return `return ${script}`;
};

// ({ sessionId: String?, script: String | Function, args?: Array<JSONValue> }) => Promise<Any>.
const execute = ({ sessionId = sessionStore.getSessionId(), script, args = [] }) => {
  return platform.select({
    native: () => {
      if (typeof script === "function") {
        return Promise.reject(new NotSupportedError("Functions are only supported in the Web context."));
      }

      return request({
        method: "POST",
        path: `/session/${sessionId}/execute`,
        payload: { script, args }
      });
    },
    web: () => {
      return request({
        method: "POST",
        path: `/session/${sessionId}/execute`,
        payload: {
          script: getWebScript(script),
          args
        }
      });
    }
  });
};

module.exports = execute;