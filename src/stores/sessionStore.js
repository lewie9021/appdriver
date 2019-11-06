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
    getCapabilities: () => state.capabilities,
    getScreenRecording: () => state.screenRecording
  };
}

module.exports = {
  createSessionStore,
  sessionStore: createSessionStore()
};