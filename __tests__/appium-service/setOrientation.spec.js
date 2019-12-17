jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a POST request to the correct Appium endpoint", async () => {
  const sessionId = "sessionId";
  const orientation = "PORTRAIT";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.setOrientation({ orientation }))
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/orientation`,
    payload: { orientation }
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const orientation = "LANDSCAPE";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue();

  await expect(appiumService.setOrientation({ sessionId, orientation }))
    .resolves.toEqual(undefined);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/orientation`,
    payload: { orientation }
  });
});