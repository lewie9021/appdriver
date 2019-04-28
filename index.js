const { by } = require("./src/matchers");
const commands = require("./src/commands");
const device = require("./src/device");
const gestures = require("./src/gestures");
const { element } = require("./src/element");

module.exports = {
  by,
  element,
  device,
  commands, // TODO: Remove this export.
  gestures // TODO: Remove this export.
};