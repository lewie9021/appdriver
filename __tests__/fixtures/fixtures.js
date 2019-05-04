const defaults = {
  status: 0,
  sessionId: "sessionId"
};

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

const createElementTextFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  text
}) => ({
  status,
  sessionId,
  value: text
});

module.exports = {
  createElementFixture,
  createElementTextFixture
};