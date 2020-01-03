jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a GET request to the correct Appium endpoint", async () => {
  const sessionId = "sessionId";
  const visible = true;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(visible);

  await expect(appiumService.getKeyboardVisible())
    .resolves.toEqual(visible);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/appium/device/is_keyboard_shown`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const visible = false;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(visible);

  await expect(appiumService.getKeyboardVisible({ sessionId }))
    .resolves.toEqual(visible);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/appium/device/is_keyboard_shown`
  });
});