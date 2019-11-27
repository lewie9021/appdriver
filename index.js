const { appiumService } = require("./src/worker/services/appiumService");
const { Device } = require("./src/worker/Device");
const { Element } = require("./src/worker/Element");
const { Expect } = require("./src/worker/Expect");
const matchers = require("./src/worker/matchers");
const gestures = require("./src/worker/gestures");
const { ElementsNotFoundError, AppiumError } = require("./src/worker/errors");
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