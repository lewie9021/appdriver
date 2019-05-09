const mockSession = (session) => {
  global.session = {
    platformName: "iOS",
    ...session
  };
};

module.exports = mockSession;