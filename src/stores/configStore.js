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
    getFindTimeout: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceFindTimeout = device ? device.findTimeout : null;

      return deviceFindTimeout || state.config.findTimeout || (10 * 1000);
    },
    getFindInterval: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceFindInterval = device ? device.findInterval : null;

      return deviceFindInterval || state.config.findInterval || 200;
    },
    getWaitTimeout: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceWaitTimeout = device ? device.waitTimeout : null;

      return deviceWaitTimeout || state.config.waitTimeout || (10 * 1000);
    },
    getWaitInterval: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceWaitInterval = device ? device.waitInterval : null;

      return deviceWaitInterval || state.config.waitInterval || 200;
    },
    getMaxSpecRetries: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceMaxSpecRetries = device ? device.maxSpecRetries : null;

      return deviceMaxSpecRetries || state.config.maxSpecRetries || 2;
    },
    getSpecPaths: (deviceIndex = state.deviceIndex) => {
      const device = state.config.devices[deviceIndex];
      const deviceSpecs = (device && device.specs) || [];

      return [ ...state.config.specs, ...deviceSpecs ]
        .map((relativeSpecPath) => path.resolve(path.dirname(state.configPath), relativeSpecPath));
    },
    getReporters: () => {
      if (!state.config.reporters || !state.config.reporters.length) {
        return [require("../reporters/basicReporter")];
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