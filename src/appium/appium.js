const api = require("./api");
const { getSession } = require("../session");
const { ElementNotFoundError, ElementsNotFoundError } = require("../errors");

// findElement = ({ using: String, value: String, elementId?: String }) => Promise<String>.
const findElement = ({ using, value, elementId }) => {
  const sessionId = getSession("sessionId");

  if (elementId) {
    return api.post(`/session/${sessionId}/element/${elementId}/element`, null, { using, value })
      .then(({status, value}) => {
        if (status) {
          throw new ElementNotFoundError("Failed to find element from element.");
        }

        return value.ELEMENT;
      });
  }

  return api.post(`/session/${sessionId}/element`, null, { using, value })
    .then(({ status, value }) => {
      if (status) {
        throw new ElementNotFoundError("Failed to find element.");
      }

      return value.ELEMENT;
    });
};

// findElements = ({ using: String, value: String, elementId?: String }) => Promise<Array<String>>.
const findElements = ({ using, value, elementId }) => {
  const sessionId = getSession("sessionId");

  if (elementId) {
    return api.post(`/session/${sessionId}/element/${elementId}/elements`, null, { using, value })
      .then(({status, value}) => {
        if (status) {
          throw new ElementsNotFoundError("Failed to find elements from element.");
        }

        return value.map((element) => element.ELEMENT);
      });
  }

  return api.post(`/session/${sessionId}/elements`, null, { using, value })
    .then(({status, value}) => {
      if (status) {
        throw new ElementsNotFoundError("Failed to find elements.");
      }

      return value.map((element) => element.ELEMENT);
    });
};

// getElementAttribute = ({ elementId: String, attribute: String }) => Promise<String>.
const getElementAttribute = ({ elementId, attribute }) => {
  return api.get(`/session/${getSession("sessionId")}/element/${elementId}/attribute/${attribute}`)
    .then(({ status, value }) => {
      if (status) {
        throw new Error("Failed to get attribute of element.");
      }

      return value;
    });
};