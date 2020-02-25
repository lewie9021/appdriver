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
  const appId = "appId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(sessionStore, "getAppId").mockReturnValue(appId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.restartApp())
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(2);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/terminate_app`,
    payload: { appId }
  });
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/activate_app`,
    payload: { appId }
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const appId = "appId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(sessionStore, "getAppId").mockReturnValue(appId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.restartApp({ sessionId }))
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(2);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/terminate_app`,
    payload: { appId }
  });
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/activate_app`,
    payload: { appId }
  });
});

it("optionally accepts an appId", async () => {
  const sessionId = "sessionId";
  const appId = "newAppId";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(sessionStore, "getAppId").mockReturnValue("appId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.restartApp({ appId }))
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(2);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/terminate_app`,
    payload: { appId }
  });
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/appium/device/activate_app`,
    payload: { appId }
  });
});