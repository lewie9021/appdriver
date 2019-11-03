const api = require("./api");
const { getSession } = require("../session");
const { platform } = require("../utils");

// ({ desiredCapabilities: AppiumCapability }) => Promise<AppiumCapability>.
const createSession = ({ desiredCapabilities }) => {
  return api.post("/session", null, { desiredCapabilities })
    .then(({ status, value }) => {
      if (!status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ sessionId: String }) => Promise.
const endSession = ({ sessionId }) => {
  return api.del(`/session/${sessionId}`)
    .then(({ status, value }) => {
      if (!status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// () => Promise<{ width: Number, height: Number }>.
const getViewport = () => {
  return api.get(`/session/${getSession("sessionId")}/window/rect`)
    .then(({ status, value }) => {
      if (!status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// () => Promise<String>.
const getOrientation = () => {
  return api.get(`/session/${getSession("sessionId")}/orientation`)
    .then(({ status, value }) => {
      if (!status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// () => Promise<String>.
const takeScreenshot = () => {
  return api.get(`/session/${getSession("sessionId")}/screenshot`)
    .then(({ status, value }) => {
      if (!status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ matcher: AppiumMatcher, element: AppiumElement }) => Promise<AppiumElement>.
const findElement = ({ matcher, element }) => {
  const sessionId = getSession("sessionId");

  if (element) {
    return api.post(`/session/${sessionId}/element/${element.ELEMENT}/element`, null, matcher)
      .then(({ status, value }) => {
        if (status) {
          throw new Error("GENERAL_ERROR");
        }

        return value;
      });
  }

  return api.post(`/session/${sessionId}/element`, null, matcher)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ matcher: AppiumMatcher, element: AppiumElement }) => Promise<Array<AppiumElement>>.
const findElements = ({ matcher, element }) => {
  const sessionId = getSession("sessionId");

  if (element) {
    return api.post(`/session/${sessionId}/element/${element.ELEMENT}/elements`, null, matcher)
      .then(({ status, value }) => {
        if (status) {
          throw new Error("GENERAL_ERROR");
        }

        return value;
      });
  }

  return api.post(`/session/${sessionId}/elements`, null, matcher)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement, attribute: String }) => Promise<String>.
const getElementAttribute = ({ element, attribute }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/attribute/${attribute}`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
// Note: doesn't work on iOS yet. See https://github.com/appium/appium/issues/13441.
const getElementSelected = ({ element }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/selected`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
const getElementDisabled = ({ element }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/enabled`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return !value;
    });
};

// ({ element: AppiumElement }) => Promise<Boolean>.
const getElementVisible = ({ element }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/displayed`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<{ width: Number, height: Number }>.
const getElementSize = ({ element }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/size`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementName = ({ element }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/name`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementType = ({ element }) => {
  const spec = {
    ios: () => getElementName({ element }),
    android: () => getElementAttribute({ element, attribute: "className"})
  };

  return platform.select(spec)
    .catch((err) => {
      console.log(err);
      throw new Error("GENERAL_ERROR");
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
  return api.get(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/text`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement }) => Promise<String>.
const getElementValue = ({ element }) => {
  const spec = {
    ios: () => getElementAttribute({ element, attribute: "value" }),
    android: () => getElementText({ element })
  };

  return platform.select(spec)
    .catch((err) => {
      console.log(err);
      throw new Error("GENERAL_ERROR");
    });
};

// ({ element: AppiumElement, relative: Boolean }) => Promise<{ x: Number, y: Number }>.
const getElementLocation = ({ element, relative }) => {
  const sessionId = getSession("sessionId");

  if (relative) {
    return api.get(`/session/${sessionId}/element/${element.ELEMENT}/location_in_view`)
      .then(({ status, value }) => {
        if (status) {
          throw new Error("GENERAL_ERROR");
        }

        return value;
      });
  }

  return api.get(`/session/${sessionId}/element/${element.ELEMENT}/location`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }

      return value;
    });
};

// ({ element: AppiumElement, text: String }) => Promise.
const sendElementText = ({ element, text }) => {
  return api.post(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/value`, null, { value: text })
    .then(({ status }) => {
      if (status) {
        if (status === 13 && getSession("platformName") === "iOS") {
          throw new Error("HARDWARE_KEYBOARD_CONNECTED");
        }

        throw new Error("GENERAL_ERROR");
      }
    });
};

// ({ element: AppiumElement }) => Promise.
const clearElementText = ({ element }) => {
  return api.post(`/session/${getSession("sessionId")}/element/${element.ELEMENT}/clear`)
    .then(({ status }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }
    });
};

// ({ actions: W3CActions }) => Promise.
const performActions = ({ actions }) => {
  return api.post(`/session/${getSession("sessionId")}/actions`, null, { actions })
    .then(({ status }) => {
      if (status) {
        throw new Error("GENERAL_ERROR");
      }
    });
};