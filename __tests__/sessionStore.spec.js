const { createSessionStore } = require("../src/stores/sessionStore");

it("returns null if there's no sessionId", () => {
  const sessionStore = createSessionStore();

  const result = sessionStore.getSessionId();

  expect(result).toBeNull();
});

it("returns the sessionId if a session has been created", () => {
  const sessionId = "sessionId";
  const sessionStore = createSessionStore();
  sessionStore.setState({ sessionId });

  const result = sessionStore.getSessionId();

  expect(result).toEqual(sessionId);
});

it("returns null if there's no capabilities", () => {
  const sessionStore = createSessionStore();

  const result = sessionStore.getCapabilities();

  expect(result).toBeNull();
});

it("returns the capabilities if a session has been created", () => {
  const capabilities = { platformName: "iOS", platformVersion: "12.4", deviceName: "iPhone X",  app: "path" };
  const sessionStore = createSessionStore();
  sessionStore.setState({ capabilities });

  const result = sessionStore.getCapabilities();

  expect(result).toEqual(capabilities);
});

it("returns the capability when a key parameter is passed", () => {
  const capabilities = { platformName: "iOS", platformVersion: "12.4", deviceName: "iPhone X",  app: "path" };
  const key = "deviceName";
  const sessionStore = createSessionStore();
  sessionStore.setState({ capabilities });

  const result = sessionStore.getCapabilities(key);

  expect(result).toEqual(capabilities[key]);
});

it("returns null if there's no screen recording in progress", () => {
  const sessionStore = createSessionStore();

  const result = sessionStore.getScreenRecording();

  expect(result).toBeNull();
});

it("returns the screen recording options if a recording is in progress", () => {
  const screenRecording = { filePath: "some/path" };
  const sessionStore = createSessionStore();
  sessionStore.setState({ screenRecording });

  const result = sessionStore.getScreenRecording();

  expect(result).toEqual(screenRecording);
});

it("returns the screen recording option when a key parameter is passed", () => {
  const screenRecording = { filePath: "some/path" };
  const key = "filePath";
  const sessionStore = createSessionStore();
  sessionStore.setState({ screenRecording });

  const result = sessionStore.getScreenRecording(key);

  expect(result).toEqual(screenRecording[key]);
});