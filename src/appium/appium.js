const api = require("./api-v2");
const { NotImplementedError } = require("../errors");
const { platform } = require("../utils");

// () => Promise<Object>.
const getStatus = () => {
  return api.get({ path: "/status" });
};

// ({ desiredCapabilities: AppiumCapability }) => Promise<AppiumCapability>.
const createSession = ({ desiredCapabilities }) => {
  return api.post({
    path: "/session",
    payload: { desiredCapabilities },
    transform: (data) => ({
      sessionId: data.sessionId,
      capabilities: data.value
    })
  });
};

// ({ sessionId: String }) => Promise.
const endSession = ({ sessionId }) => {
  return api.del({ path: `/session/${sessionId}` })
};

// ({ sessionId: String }) => Promise.
const launchApp = ({ sessionId }) => {
  return api.post({ path: `/session/${sessionId}/appium/app/launch` });
};

// ({ sessionId: String }) => Promise.
const closeApp = ({ sessionId }) => {
  return api.post({ path: `/session/${sessionId}/appium/app/close` });
};

// ({ sessionId: String }) => Promise.
const resetApp = ({ sessionId }) => {
  return api.post({ path: `/session/${sessionId}/appium/app/reset` });
};

// ({ sessionId: String }) => Promise<{ width: Number, height: Number }>.
const getViewport = ({ sessionId }) => {
  return api.get({ path: `/session/${sessionId}/window/rect` });
};

// ({ sessionId: String }) => Promise<String>.
const getOrientation = ({ sessionId }) => {
  return api.get({ path: `/session/${sessionId}/orientation` });
};

// ({ sessionId: String, orientation: String }) => Promise.
const setOrientation = ({ sessionId, orientation }) => {
  return api.post({
    path: `/session/${sessionId}/orientation`,
    payload: { orientation }
  });
};

// ({ sessionId: String }) => Promise<String>.
const takeScreenshot = ({ sessionId }) => {
  return api.get(`/session/${sessionId}/screenshot`);
};

// ({ sessionId: String, ...options: Object }) => Promise.
const startScreenRecording = ({ sessionId, ...options}) => {
  return api.post({
    path: `/session/${sessionId}/appium/start_recording_screen`,
    payload: options
  });
};

// ({ sessionId: String }) => Promise<String>.
const stopScreenRecording = ({ sessionId }) => {
  return api.post({ path: `/session/${sessionId}/appium/stop_recording_screen` });
};

// ({ sessionId: String }) => Promise<Boolean>.
const getKeyboardVisible = ({ sessionId }) => {
  return api.get({ path: `/session/${sessionId}/appium/device/is_keyboard_shown` });
};

// ({ sessionId: String }) => Promise.
const hideKeyboard = ({ sessionId }) => {
  return api.post({ path: `/session/${sessionId}/appium/device/hide_keyboard` });
};

// ({ sessionId: String }) => Promise.
const goBack = ({ sessionId }) => {
  return platform.select({
    ios: () => Promise.reject(new NotImplementedError()),
    android: () => api.post({ path: `/session/${sessionId}/back` })
  });
};

// ({ sessionId: String, actions: W3CActions }) => Promise.
const performActions = ({ sessionId, actions }) => {
  return api.post({
    path: `/session/${sessionId}/actions`,
    payload: { actions }
  });
};

// ({ sessionId: String, atcher: AppiumMatcher, element: AppiumElement }) => Promise<AppiumElement>.
const findElement = ({ sessionId, matcher, element }) => {
  if (element) {
    return api.post({
      path: `/session/${sessionId}/element/${element.ELEMENT}/element`,
      payload: matcher
    });
  }

  return api.post({
    path: `/session/${sessionId}/element`,
    payload: matcher
  });
};

// ({ sessionId: String, matcher: AppiumMatcher, element: AppiumElement }) => Promise<Array<AppiumElement>>.
const findElements = ({ sessionId, matcher, element }) => {
  if (element) {
    return api.post({
      path: `/session/${sessionId}/element/${element.ELEMENT}/elements`,
      payload: matcher
    });
  }

  return api.post({
    path: `/session/${sessionId}/elements`,
    payload: matcher
  });
};

// ({ sessionId: String, element: AppiumElement, attribute: String }) => Promise<String>.
const getElementAttribute = ({ sessionId, element, attribute }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/attribute/${attribute}` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<Boolean>.
// Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
const getElementSelected = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/selected` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<Boolean>.
const getElementDisabled = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/enabled` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<Boolean>.
const getElementVisible = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/displayed` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<{ width: Number, height: Number }>.
const getElementSize = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/size` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<String>.
const getElementName = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/name` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<String>.
const getElementType = ({ sessionId, element }) => {
  return platform.select({
    ios: () => getElementName({ element }),
    android: () => getElementAttribute({ element, attribute: "className"})
  });
};

// ({ sessionId: String, matcher: AppiumMatcher })
const getElementExists = ({ sessionId, matcher }) => {
  return findElement({ sessionId, matcher })
    .then(() => true)
    .catch(() => false);
};

// ({ sessionId: String, element: AppiumElement }) => Promise<String>.
const getElementText = ({ sessionId, element }) => {
  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/text` });
};

// ({ sessionId: String, element: AppiumElement }) => Promise<String>.
const getElementValue = ({ sessionId, element }) => {
  return platform.select({
    ios: () => getElementAttribute({ sessionId, element, attribute: "value" }),
    android: () => getElementText({ sessionId, element })
  });
};

// ({ sessionId: String, element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
const getElementLocation = ({ sessionId, element, relative }) => {
  if (relative) {
    return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/location_in_view` });
  }

  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/location` });
};

// ({ sessionId: String, element: AppiumElement, text: String }) => Promise.
// Note: status of 13 means hardware keyboard needs to be disconnected.
const sendElementText = ({ sessionId, element, text }) => {
  return api.post({
    path: `/session/${sessionId}/element/${element.ELEMENT}/value`,
    payload: { value: text }
  });
};

// ({ sessionId: String, element: AppiumElement }) => Promise.
const clearElementText = ({ sessionId, element }) => {
  return api.post({ path: `/session/${sessionId}/element/${element.ELEMENT}/clear` });
};

module.exports = {
  getStatus,

  createSession,
  endSession,

  launchApp,
  closeApp,
  resetApp,

  getViewport,
  getOrientation,
  setOrientation,
  takeScreenshot,
  startScreenRecording,
  stopScreenRecording,
  getKeyboardVisible,
  hideKeyboard,
  goBack,
  performActions,

  findElement,
  findElements,

  getElementAttribute,
  getElementSelected,
  getElementDisabled,
  getElementVisible,
  getElementSize,
  getElementName,
  getElementType,
  getElementExists,
  getElementText,
  getElementValue,
  getElementLocation,
  sendElementText,
  clearElementText
};