const defaults = {
  status: 0,
  sessionId: "sessionId"
};

const createFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  value = null
} = {}) => ({
  status,
  sessionId,
  value
});

// /session/:sessionId/element/:elementId.
const createElementFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  elementId
}) => ({
  status,
  sessionId,
  value: {
    "element-6066-11e4-a52e-4f735466cecf": elementId,
    ELEMENT: elementId
  }
});

// /session/:sessionId/element/:elementId/text.
const createElementTextFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  text
}) => createFixture({status, sessionId, value: text});

// /session/:sessionId/element/:elementId/click.
const createElementClickFixture = ({
 status = defaults.status,
 sessionId = defaults.sessionId
} = {}) => createFixture({status, sessionId, value: ""});

// /session/:sessionId/element/:elementId/value.
const createElementValueFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  value
} = {}) => createFixture({status, sessionId, value});

// /session/:sessionId/element/:elementId/clear.
const createElementClearFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId
} = {}) => createFixture({status, sessionId});

// /session/:sessionId/element/:elementId/displayed.
const createElementDisplayedFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  displayed
}) => createFixture({status, sessionId, value: displayed});

// /session/:sessionId/element/:elementId/size.
const createElementSizeFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  width,
  height
}) => createFixture({status, sessionId, value: {width, height}});

// /session/:sessionId/window/rect.
const createSessionWindowRectFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  width,
  height
}) => createFixture({status, sessionId, value: {width, height, x: 0, y: 0}});

// /session/:sessionId/element/:elementId/location.
const createElementLocationFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  x,
  y
}) => createFixture({status, sessionId, value: {x, y}});

module.exports = {
  createFixture,
  createElementFixture,
  createElementClickFixture,
  createElementTextFixture,
  createElementValueFixture,
  createElementClearFixture,
  createElementDisplayedFixture,
  createElementSizeFixture,
  createSessionWindowRectFixture,
  createElementLocationFixture
};