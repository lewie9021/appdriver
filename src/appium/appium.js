const api = require("./api-v2");
const { NotImplementedError } = require("../errors");
const { getSession } = require("../session");
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

// () => Promise.
const launchApp = () => {
  return api.post({ path: "/appium/app/launch" });
};

// () => Promise.
const closeApp = () => {
  return api.post({ path: "/appium/app/close" });
};

// () => Promise.
const resetApp = () => {
  return api.post({ path: "/appium/app/reset" });
};

// () => Promise<{ width: Number, height: Number }>.
const getViewport = () => {
  return api.get({ path: `/session/${getSession("sessionId")}/window/rect` });
};

// () => Promise<String>.
const getOrientation = () => {
  return api.get({ path: `/session/${getSession("sessionId")}/orientation` });
};

// ({ orientation: String }) => Promise.
const setOrientation = ({ orientation }) => {
  return api.post({
    path: `/session/${getSession("sessionId")}/orientation`,
    payload: { orientation }
  });
};

// () => Promise<String>.
const takeScreenshot = () => {
  return api.get(`/session/${getSession("sessionId")}/screenshot`);
};

// (options: Object) => Promise.
const startScreenRecording = (options) => {
  return api.post({
    path: `/session/${getSession("sessionId")}/appium/start_recording_screen`,
    payload: options
  });
};

// () => Promise<String>.
const stopScreenRecording = () => {
  return api.post({ path: `/session/${getSession("sessionId")}/appium/stop_recording_screen` });
};

// () => Promise<Boolean>.
const getKeyboardVisible = () => {
  return api.get({ path: `/session/${getSession("sessionId")}/appium/device/is_keyboard_shown` });
};

// () => Promise.
const hideKeyboard = () => {
  return api.post({ path: `/session/${getSession("sessionId")}/appium/device/hide_keyboard` });
};

// () => Promise.
const goBack = () => {
  if (getSession("platformName") === "iOS") {
    return Promise.reject(new NotImplementedError());
  }

  return api.post({ path: `/session/${getSession("sessionId")}/back` });
};

// ({ actions: W3CActions }) => Promise.
const performActions = ({ actions }) => {
  return api.post({
    path: `/session/${getSession("sessionId")}/actions`,
    payload: { actions }
  });
};

// ({ matcher: AppiumMatcher, element: AppiumElement }) => Promise<AppiumElement>.
const findElement = ({ matcher, element }) => {
  const sessionId = getSession("sessionId");

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

// ({ matcher: AppiumMatcher, element: AppiumElement }) => Promise<Array<AppiumElement>>.
const findElements = ({ matcher, element }) => {
  const sessionId = getSession("sessionId");

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

// ({ element: AppiumElement, attribute: String }) => Promise<String>.
const getElementAttribute = ({ element, attribute }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/attribute/${attribute}` });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
// Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
const getElementSelected = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/selected` });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
const getElementDisabled = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/enabled` });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
const getElementVisible = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/displayed` });
};

// ({ element: AppiumElement }) => Promise<{ width: Number, height: Number }>.
const getElementSize = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/size` });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementName = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/name` });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementType = ({ element }) => {
  return platform.select({
    ios: () => getElementName({ element }),
    android: () => getElementAttribute({ element, attribute: "className"})
  });
};

// ({ matcher: AppiumMatcher })
const getElementExists = ({ matcher }) => {
  return findElement({ matcher })
    .then(() => true)
    .catch(() => false);
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementText = ({ element }) => {
  return api.get({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/text` });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementValue = ({ element }) => {
  return platform.select({
    ios: () => getElementAttribute({ element, attribute: "value" }),
    android: () => getElementText({ element })
  });
};

// ({ element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
const getElementLocation = ({ element, relative }) => {
  const sessionId = getSession("sessionId");

  if (relative) {
    return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/location_in_view` });
  }

  return api.get({ path: `/session/${sessionId}/element/${element.ELEMENT}/location` });
};

// ({ element: AppiumElement, text: String }) => Promise.
// Note: status of 13 means hardware keyboard needs to be disconnected.
const sendElementText = ({ element, text }) => {
  return api.post({
    path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/value`,
    payload: { value: text }
  });
};

// ({ element: AppiumElement }) => Promise.
const clearElementText = ({ element }) => {
  return api.post({ path: `/session/${getSession("sessionId")}/element/${element.ELEMENT}/clear` });
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