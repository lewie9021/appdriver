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
  element: (matcher, options) => {
    return new Element({
      value: Promise.resolve({ ref: null, matcher }),
      options
    });
  },
  elements: (matcher, options) => {
    return appiumService.findElements({ matcher })
      .then((refs) => {
        return refs.map((ref) => {
          return new Element({
            value: Promise.resolve({ ref, matcher: null }),
            options
          });
        });
      })
      .catch((err) => {
        if (isInstanceOf(err, AppiumError)) {
          throw new ElementsNotFoundError(matcher);
        }

        throw err;
      });
  },
  expect: (value) => {
    return new Expect(value);
  },
  gestures
};