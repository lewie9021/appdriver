jest.mock("node-fetch");

const fixtures = require("../fixtures/fixtures");
const mockRequests = require("./mockRequests");

const BASE_URL = "http://localhost:4723/wd/hub";

const mockClickElement = ({status, elementId}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/click`,
    response: fixtures.createElementClickFixture({status})
  });
};

const mockElementType = ({status, elementId, type}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/name`,
    response: fixtures.createFixture({status, value: type})
  });
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/elementId/attribute/className`,
    response: fixtures.createFixture({status, value: type})
  });
};

const mockElementText = ({status, elementId, text}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/text`,
    response: fixtures.createFixture({status, value: text})
  });
};

const mockElementValue = ({status, elementId, value}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/attribute/value`,
    response: fixtures.createFixture({status, value})
  });
};

const mockElementSendKeys = ({status} = {}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/value`,
    response: fixtures.createElementValueFixture({status})
  });
};

const mockClearElement = ({status} = {}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/clear`,
    response: fixtures.createElementClearFixture({status})
  });
};

const mockElementDisplayed = ({status, elementId, displayed}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/displayed`,
    response: fixtures.createFixture({status, value: displayed})
  });
};

const mockElementSize = ({status, elementId, width, height}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/size`,
    response: fixtures.createFixture({status, value: {width, height}})
  })
};

const mockElementLocation = ({status, elementId, x, y}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/location`,
    response: fixtures.createFixture({status, value: {x, y}})
  })
};

const mockElementLocationInView = ({status, elementId, x, y}) => {
  mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/location_in_view`,
    response: fixtures.createFixture({status, value: {x, y}})
  })
};

const mockFindElement = ({status, elementId}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: fixtures.createElementFixture({status, elementId})
  });
};

const mockFindElementsFromElement = ({status, elementId, elements}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/elements`,
    response: fixtures.createElementsFixture({status, elementIds: elements})
  });
};

const mockActions = ({status} = {}) => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/actions`,
    response: fixtures.createFixture({status, value: {}})
  });
};

const resetMocks = () => {
  mockRequests.reset();
};

module.exports = {
  mockFindElement,
  mockFindElementsFromElement,
  mockClickElement,
  mockElementSendKeys,
  mockClearElement,
  mockElementDisplayed,
  mockElementSize,
  mockElementLocation,
  mockElementLocationInView,
  mockElementType,
  mockElementText,
  mockElementValue,
  mockActions,
  resetMocks
};