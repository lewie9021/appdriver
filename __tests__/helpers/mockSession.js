const session = require("../../src/session");

const mockSession = (sessionValue) => {
  session.getSession
    .mockImplementation((property) => {
      if (property) {
        return sessionValue[property];
      }

      return sessionValue;
    });
};

module.exports = mockSession;