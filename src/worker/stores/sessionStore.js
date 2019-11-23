function createSessionStore() {
  let state = {
    sessionId: null,
    capabilities: null,
    screenRecording: null
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
    getScreenRecording: (key) => {
      if (key) {
        return state.screenRecording[key];
      }

      return state.screenRecording;
    }
  };
}

module.exports = {
  createSessionStore,
  sessionStore: createSessionStore()
};