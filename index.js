const matchers = require("./src/matchers-v2");
const { Device } = require("./src/device");
const expect = require("./src/expect");
const gestures = require("./src/gestures");
const { Element } = require("./src/element");
const elements = require("./src/elements");

module.exports = {
  by: matchers,
  device: new Device(),
  element: (matcher) => {
    return new Element({ value: Promise.resolve({ matcher, element: null }) });
  },
  elements,
  expect,
  gestures
};