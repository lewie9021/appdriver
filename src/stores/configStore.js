const path = require("path");

function createConfigStore() {
  let state = {
    configPath: null,
    deviceIndex: null,
    config: null
  };

  return {
    setState: (nextState) => {
      state = {
        ...state,
        ...nextState
      };
    },
    getBaseUrl: () => {
      return (state.config.appium && state.config.appium.baseUrl) || "http://localhost:4723/wd/hub";
    },
    getSpecPaths: () => {
      return state.config.specs.map((relativeSpecPath) => path.resolve(path.dirname(state.configPath), relativeSpecPath));
    },
    getReporters: () => {
      if (!state.config.reporters || !state.config.reporters.length) {
        return [ require("../reporters/simpleReporter") ];
      }

      return state.config.reporters;
    },
    getDevices: () => {
      return state.config.devices;
    },
    getDevice: (deviceIndex = state.deviceIndex) => {
      return state.config.devices[deviceIndex];
    },
    getMaxDevices: () => {
      return state.config.maxDevices || 1;
    }
  };
}

module.exports = {
  createConfigStore,
  configStore: createConfigStore()
};