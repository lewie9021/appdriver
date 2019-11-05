const { by } = require("./src/matchers");
const { Device } = require("./src/device");
const expect = require("./src/expect");
const gestures = require("./src/gestures");
const { Element } = require("./src/element");
const elements = require("./src/elements");

module.exports = {
  by,
  device: new Device(),
  element: (matcher) => new Element({ matcher }),
  elements,
  expect,
  gestures
};