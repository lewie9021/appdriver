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

const setConfig = ({ baseUrl, findInterval, findTimeout, waitInterval, waitTimeout } = {}) => {
  jest.spyOn(configStore, "getBaseUrl").mockReturnValue(baseUrl);
  jest.spyOn(configStore, "getFindInterval").mockReturnValue(findInterval);
  jest.spyOn(configStore, "getFindTimeout").mockReturnValue(findTimeout);
  jest.spyOn(configStore, "getWaitInterval").mockReturnValue(waitInterval);
  jest.spyOn(configStore, "getWaitTimeout").mockReturnValue(waitTimeout);
};

module.exports = {
  setPlatform,
  setConfig
};