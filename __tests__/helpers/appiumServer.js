jest.mock("node-fetch");

const fixtures = require("../fixtures/fixtures");
const mockRequests = require("./mockRequests");

const BASE_URL = "http://localhost:4723/wd/hub";

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

const mockElementEnabled = ({status, elementId, enabled}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/enabled`,
    response: fixtures.createFixture({status, value: enabled})
  });
};

const mockElementAttribute = ({status, elementId, name, value}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/element/${elementId}/attribute/${name}`,
    response: fixtures.createFixture({status, value})
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

const mockGetOrientation = ({status, orientation}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/orientation`,
    response: fixtures.createFixture({ status, value: orientation })
  });
};

const mockSetOrientation = ({status} = {}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/orientation`,
    response: fixtures.createFixture({ status })
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

const mockScreenshot = ({status, data}) => {
  return mockRequests.get({
    url: `${BASE_URL}/session/sessionId/screenshot`,
    response: fixtures.createFixture({status, value: data})
  });
};

const mockStartRecordingScreen = ({status} = {}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/appium/start_recording_screen`,
    response: fixtures.createFixture({status})
  });
};

const mockStopRecordingScreen = ({status, value}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/appium/stop_recording_screen`,
    response: fixtures.createFixture({status, value})
  });
};

const mockBack = ({status} = {}) => {
  return mockRequests.post({
    url: `${BASE_URL}/session/sessionId/back`,
    response: fixtures.createFixture({status, value: null})
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
  mockElementSendKeys,
  mockClearElement,
  mockElementDisplayed,
  mockElementSize,
  mockElementEnabled,
  mockElementAttribute,
  mockElementLocation,
  mockElementLocationInView,
  mockElementType,
  mockElementText,
  mockElementValue,
  mockWindowRect,
  mockGetOrientation,
  mockSetOrientation,
  mockActions,
  mockHideKeyboard,
  mockIsKeyboardShown,
  mockScreenshot,
  mockStartRecordingScreen,
  mockStopRecordingScreen,
  mockBack,
  resetMocks,
  getCalls
};