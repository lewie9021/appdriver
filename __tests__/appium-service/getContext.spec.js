jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a GET request to the correct Appium endpoint", async () => {
  const sessionId = "sessionId";
  const contextId = "NATIVE_APP";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request")
    .mockResolvedValueOnce(contextId)
    .mockResolvedValueOnce([ contextId, "WEBVIEW_41490.2", "WEBVIEW_41490.3" ]);

  await expect(appiumService.getContext())
    .resolves.toEqual({
      id: contextId,
      title: null,
      url: null
    });

  expect(requestHelpers.request).toHaveBeenCalledTimes(2);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/context`
  });
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/contexts`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const contextId = "NATIVE_APP";
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request")
    .mockResolvedValueOnce(contextId)
    .mockResolvedValueOnce([ contextId, "WEBVIEW_41490.2", "WEBVIEW_41490.3" ]);

  await expect(appiumService.getContext({ sessionId }))
    .resolves.toEqual({
      id: contextId,
      title: null,
      url: null
    });

  expect(requestHelpers.request).toHaveBeenCalledTimes(2);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/context`
  });
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/contexts`
  });
});