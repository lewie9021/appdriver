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
  const visible = true;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(visible);

  await expect(appiumService.getElementVisibleAttribute({ element: ref }))
    .resolves.toEqual(visible);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/displayed`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const ref = createFindElementMock();
  const visible = false;
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(visible);

  await expect(appiumService.getElementVisibleAttribute({ sessionId, element: ref }))
    .resolves.toEqual(visible);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/displayed`
  });
});