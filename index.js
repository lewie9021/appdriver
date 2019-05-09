const { by } = require("./src/matchers");
const device = require("./src/device");
const expect = require("./src/expect");
const gestures = require("./src/gestures");
const { element } = require("./src/element");
const elements = require("./src/elements");

module.exports = {
  by,
  element,
  elements,
  device,
  expect,
  gestures
};