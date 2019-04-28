const commands = require("./commands");

const by = {
  id: (id) => ({
    type: "id",
    value: id,
    resolve: () => {
      return commands.element.findElement({
        using: "id",
        value: id
      })
    }
  }),
  label: (accessibilityId) => ({
    type: "accessibility id",
    value: accessibilityId,
    resolve: () => {
      return commands.element.findElement({
        using: "accessibility id",
        value: accessibilityId
      })
    }
  })
};

module.exports = {
  by
};