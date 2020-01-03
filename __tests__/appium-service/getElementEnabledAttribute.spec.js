jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a GET request to the correct Appium endpoint", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock();
  const enabled = true;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(enabled);

  await expect(appiumService.getElementEnabledAttribute({ element: ref }))
    .resolves.toEqual(enabled);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/enabled`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const ref = createFindElementMock();
  const enabled = false;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(enabled);

  await expect(appiumService.getElementEnabledAttribute({ sessionId, element: ref }))
    .resolves.toEqual(enabled);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/enabled`
  });
});