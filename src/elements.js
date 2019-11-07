const { sessionStore } = require("./stores/sessionStore");
const { createAppiumService } = require("./services/appiumService");
const { Element } = require("./element");

const appiumService = createAppiumService(sessionStore);

const elements = (matcher) => {
  return appiumService.findElements({ matcher })
    .then((refs) => refs.map((ref) => new Element({ value: Promise.resolve({ element: ref, matcher: null }) })));
};

module.exports = elements;