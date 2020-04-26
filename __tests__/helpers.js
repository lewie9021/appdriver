const { sessionStore } = require("../src/worker/stores/sessionStore");
const { configStore } = require("../src/stores/configStore");

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

const setConfig = ({ findInterval, findTimeout, waitForInterval, waitForTimeout } = {}) => {
  jest.spyOn(configStore, "getFindInterval").mockReturnValue(findInterval);
  jest.spyOn(configStore, "getFindTimeout").mockReturnValue(findTimeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(waitForInterval);
  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(waitForTimeout);
};

module.exports = {
  setPlatform,
  setConfig
};