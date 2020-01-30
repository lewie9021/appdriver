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
  const contexts = [ "NATIVE_APP", "WEBVIEW_41490.2", "WEBVIEW_41490.3" ];
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(contexts);

  await expect(appiumService.getContexts())
    .resolves.toEqual([
      { id: contexts[0], title: null, url: null },
      { id: contexts[1], title: null, url: null },
      { id: contexts[2], title: null, url: null }
    ]);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/contexts`
  });
});

// Note: Only applicable when 'fullContextList' capability is set (iOS only).
// See: https://appiumpro.com/editions/61
it("populates 'title' and 'url' when available", async () => {
  const sessionId = "sessionId";
  const contexts = [
    { id: "NATIVE_APP" },
    { id: "WEBVIEW_41490.2", title: "Google", url: "https://google.com" },
    { id: "WEBVIEW_41490.3", title: "AppDriver", url: "https://github.com/lewie9021/appdriver" }
  ];
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(contexts);

  await expect(appiumService.getContexts())
    .resolves.toEqual([
      { id: contexts[0].id, title: null, url: null },
      contexts[1],
      contexts[2]
    ]);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/contexts`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const contexts = [ "NATIVE_APP", "WEBVIEW_41490.2", "WEBVIEW_41490.3" ];
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(contexts);

  await expect(appiumService.getContexts({ sessionId }))
    .resolves.toEqual([
      { id: contexts[0], title: null, url: null },
      { id: contexts[1], title: null, url: null },
      { id: contexts[2], title: null, url: null }
    ]);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/contexts`
  });
});