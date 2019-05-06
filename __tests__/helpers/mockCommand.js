const { delay } = require("../../src/utils");

const mockCommand = (command, mock, timeout = 200) => {
  // if (command.mockReset) {
  //   command.mockReset();
  // }

  let callCount = 0;

  command.mockImplementation(() => {
    const currentCallCount = callCount++;

    return delay(timeout)
      .then(() => {
        if (Array.isArray(mock)) {
          return mock[currentCallCount]
            ? mock[currentCallCount]()
            : mock[mock.length - 1]();
        }

        return mock();
      });
  });
};

module.exports = mockCommand;