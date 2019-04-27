const commands = require("./commands");

const by = {
  id: (sessionId, id) => ({
    type: "id",
    value: id,
    resolve: () => {
      return commands.element.findElement(sessionId, {
        using: "id",
        value: id
      })
    }
  }),
  label: (sessionId, accessibilityId) => ({
    type: "accessibility id",
    value: accessibilityId,
    resolve: () => {
      return commands.element.findElement(sessionId, {
        using: "accessibility id",
        value: accessibilityId
      })
    }
  }),
  element: (element) => ({
    type: "element",
    value: element
  })
};

module.exports = {
  by
};