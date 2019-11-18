const { appiumService } = require("./src/services/appiumService");
const { Device } = require("./src/Device");
const { Element } = require("./src/Element");
const { Expect } = require("./src/Expect");
const matchers = require("./src/matchers");
const gestures = require("./src/gestures");
const { ElementsNotFoundError, AppiumError } = require("./src/errors");
const { isInstanceOf } = require("./src/utils");

module.exports = {
  by: matchers,
  device: new Device(),
  element: (matcher) => {
    return new Element({ value: Promise.resolve({ ref: null, matcher }) });
  },
  elements: (matcher) => {
    return appiumService.findElements({ matcher })
      .then((refs) => refs.map((ref) => new Element({ value: Promise.resolve({ ref, matcher: null }) })))
      .catch((err) => {
        if (isInstanceOf(err, AppiumError)) {
          throw new ElementsNotFoundError("Failed to find elements.", matcher);
        }

        throw err;
      });
  },
  expect: (value) => {
    return new Expect(value);
  },
  gestures
};