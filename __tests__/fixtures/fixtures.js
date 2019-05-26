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

const createElementsFixture = ({
  status = defaults.status,
  sessionId = defaults.sessionId,
  elementIds = []
}) => ({
  status,
  sessionId,
  value: elementIds.map((elementId) => ({
    "element-6066-11e4-a52e-4f735466cecf": elementId,
    ELEMENT: elementId
  }))
});

module.exports = {
  createFixture,
  createElementFixture,
  createElementsFixture
};