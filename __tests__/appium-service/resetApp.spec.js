jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes POST requests to the correct Appium endpoints", async () => {
  const sessionId = "sessionId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(false);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.resetApp())
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/app/reset`
  });
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("noReset");
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(false);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.resetApp({ sessionId }))
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/app/reset`
  });
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("noReset");
});

it("throws if 'noReset' capability is enabled", async () => {
  const sessionId = "sessionId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(true);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();
  expect.assertions(4);

  try {
    await appiumService.resetApp();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", "Unable to reset app when capabilities.noReset is enabled.");
  }

  expect(requestHelpers.request).toHaveBeenCalledTimes(0);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("noReset");
});