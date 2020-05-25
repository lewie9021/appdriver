const { sessionStore } = require("../../stores/sessionStore");
const { request } = require("../request");
const { platform } = require("../../../utils");
const { NotSupportedError } = require("../../errors");

// ({ sessionId: String?, actions: Array<Object> }) => Promise.
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

module.exports = performActions;