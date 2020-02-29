function createSessionStore() {
  let state = {
    sessionId: null,
    capabilities: null,
    screenRecording: null,
    webContext: false
  };

  return {
    setState: (nextState) => {
      state = {
        ...state,
        ...nextState
      };
    },
    resetState: () => {
      state = {
        sessionId: null,
        capabilities: null,
        screenRecording: null
      };
    },
    getSessionId: () => state.sessionId,
    getCapabilities: (key) => {
      if (key) {
        return state.capabilities[key];
      }

      return state.capabilities;
    },
    getAppId: () => {
      const { platformName, bundleId, appPackage } = state.capabilities;

      switch (platformName) {
        case "iOS": return bundleId;
        case "Android": return appPackage;
        default: return null;
      }
    },
    getScreenRecording: (key) => {
      if (key) {
        return state.screenRecording[key];
      }

      return state.screenRecording;
    },
    getWebContext: () => {
      return state.webContext;
    }
  };
}

module.exports = {
  createSessionStore,
  sessionStore: createSessionStore()
};
