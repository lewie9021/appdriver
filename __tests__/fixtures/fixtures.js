const defaults = {
  status: 0,
  sessionId: "sessionId"
};

const createFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  value = null
}) => ({
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
} = {}) => createFixture({status, sessionId, value: text});

// /session/:sessionId/element/:elementId/click.
const createElementClickFixture = ({
 status = defaults.status,
 sessionId = defaults.sessionId
} = {}) => createFixture({status, sessionId, value: ""});

// /session/:sessionId/element/:elementId/value.
const createElementValueFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId
} = {}) => createFixture({status, sessionId});

module.exports = {
  createFixture,
  createElementFixture,
  createElementClickFixture,
  createElementTextFixture,
  createElementValueFixture
};