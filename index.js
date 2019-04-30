const { by } = require("./src/matchers");
const commands = require("./src/commands");
const device = require("./src/device");
const expect = require("./src/expect");
const gestures = require("./src/gestures");
const { element } = require("./src/element");

module.exports = {
  by,
  element,
  device,
  expect,
  commands, // TODO: Remove this export.
  gestures // TODO: Remove this export.
};