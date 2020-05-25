const { sessionStore } = require("../../stores/sessionStore");
const { request } = require("../request");

// ({ sessionId: String? }) => Promise<{ width: Number, height: Number }>.
const getViewport = ({ sessionId = sessionStore.getSessionId() } = {}) => {
  return request({
    method: "GET",
    path: `/session/${sessionId}/window/rect`
  });
};

module.exports = getViewport;