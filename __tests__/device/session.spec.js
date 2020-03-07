jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the 'capabilities' and 'sessionId' for the session", async () => {
  const capabilities = "capabilities";
  const sessionId = "sessionId";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(capabilities);
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);

  expect(device.session).toEqual({ capabilities, sessionId });
  expect(sessionStore.getCapabilities).toHaveBeenCalled();
  expect(sessionStore.getSessionId).toHaveBeenCalled();
});