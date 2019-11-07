const { appiumService } = require("./src/services/appiumService");
const { Device } = require("./src/Device");
const { Element } = require("./src/Element");
const { Expect } = require("./src/Expect");
const matchers = require("./src/matchers");
const gestures = require("./src/gestures");

module.exports = {
  by: matchers,
  device: new Device(),
  element: (matcher) => {
    return new Element({ value: Promise.resolve({ ref: null, matcher }) });
  },
  elements: (matcher) => {
    return appiumService.findElements({ matcher })
      .then((refs) => refs.map((ref) => new Element({ value: Promise.resolve({ ref, matcher: null }) })));
  },
  expect: (value) => {
    return new Expect(value);
  },
  gestures
};