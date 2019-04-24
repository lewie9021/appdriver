const commands = require("./commands");

const by = {
  id: (sessionId, testId) => ({
    type: "id",
    value: testId,
    resolve: () => {
      return commands.element.findElement(sessionId, {
        using: "id",
        value: testId
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