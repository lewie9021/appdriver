const { sessionStore } = require("../src/worker/stores/sessionStore");

const setPlatform = (platform) => {
  switch (platform) {
    case "iOS":
      return jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
    case "Android":
      return jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android");
    case "Web":
      return jest.spyOn(sessionStore, "getWebContext").mockReturnValue(true);
    default:
      throw new Error(`Invalid platform '${platform}'.`);
  }
};

module.exports = {
  setPlatform
};