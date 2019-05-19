jest.mock("./src/session", () => {
  const sessionValue = {
    platformName: "iOS",
    sessionId: "sessionId"
  };

  return {
    getSession: jest.fn((property) => {
      if (property) {
        return sessionValue[property];
      }

      return sessionValue;
    })
  };
});