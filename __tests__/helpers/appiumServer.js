jest.mock("node-fetch");

const fixtures = require("../fixtures/fixtures");
const mockRequests = require("./mockRequests");

const BASE_URL = "http://localhost:4723/wd/hub";

const mockClickElement = ({status, elementId}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/click`,
    response: fixtures.createFixture({status, value: ""})
  });
};

const mockElementType = ({status, elementId, type, platformName = "iOS"}) => {
  if (platformName === "iOS") {
    return mockRequests.get({
      url: `${BASE_URL}/session/sessionId/element/${elementId}/name`,
      response: fixtures.createFixture({status, value: type})
    });
  }

  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/attribute/className`,
    response: fixtures.createFixture({status, value: type})
  });
};

const mockElementText = ({status, elementId, text}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/text`,
    response: fixtures.createFixture({status, value: text})
  });
};

const mockElementValue = ({status, elementId, value}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/attribute/value`,
    response: fixtures.createFixture({status, value})
  });
};

const mockElementSendKeys = ({status, elementId}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/value`,
    response: fixtures.createFixture({status})
  });
};

const mockClearElement = ({status, elementId}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/clear`,
    response: fixtures.createFixture({status})
  });
};

const mockElementDisplayed = ({status, elementId, displayed}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/displayed`,
    response: fixtures.createFixture({status, value: displayed})
  });
};

const mockElementSize = ({status, elementId, width, height}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/size`,
    response: fixtures.createFixture({status, value: {width, height}})
  })
};

const mockElementLocation = ({status, elementId, x, y}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/location`,
    response: fixtures.createFixture({status, value: {x, y}})
  })
};

const mockElementLocationInView = ({status, elementId, x, y}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/location_in_view`,
    response: fixtures.createFixture({status, value: {x, y}})
  })
};

const mockFindElement = ({status, elementId}) => {
  return mockRequests.post({
    name: "findElement",
    url: `${BASE_URL}/session/sessionId/element`,
    response: fixtures.createElementFixture({status, elementId})
  });
};

const mockFindElementFromElement = ({status, elementId, element}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/element`,
    response: fixtures.createElementFixture({status, elementId: element})
  });
};

const mockFindElements = ({status, elements}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/elements`,
    response: fixtures.createElementsFixture({status, elementIds: elements})
  });
};

const mockFindElementsFromElement = ({status, elementId, elements}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/elements`,
    response: fixtures.createElementsFixture({status, elementIds: elements})
  });
};

const mockWindowRect = ({status, width, height}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/window/rect`,
    response: fixtures.createFixture({status, value: {width, height}})
  });
};

const mockActions = ({status} = {}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/actions`,
    response: fixtures.createFixture({status, value: {}})
  });
};

const mockHideKeyboard = ({status} = {}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/appium/device/hide_keyboard`,
    response: fixtures.createFixture({status})
  });
};

const mockIsKeyboardShown = ({status, shown}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/appium/device/is_keyboard_shown`,
    response: fixtures.createFixture({status, value: shown})
  });
};

const resetMocks = () => {
  mockRequests.reset();
};

const getCalls = (requestId) => {
  return mockRequests.lookupCalls(requestId);
};

module.exports = {
  mockFindElement,
  mockFindElementFromElement,
  mockFindElements,
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
  mockWindowRect,
  mockActions,
  mockHideKeyboard,
  mockIsKeyboardShown,
  resetMocks,
  getCalls
};