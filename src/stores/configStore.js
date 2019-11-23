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
    getUi: () => {
      return state.config.ui || "bdd";
    },
    getTestTimeout: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceTestTimeout = device ? device.testTimeout : null;

      return deviceTestTimeout || state.config.testTimeout || (60 * 1000);
    },
    getMaxTestRetries: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceMaxTestRetries = device ? device.maxTestRetries : null;

      return deviceMaxTestRetries || state.config.maxTestRetries || 3;
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