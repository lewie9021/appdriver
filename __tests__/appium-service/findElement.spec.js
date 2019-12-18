jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a POST request to the 'Find Element' Appium endpoint", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock({ elementId: "elementId" });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(ref);

  await expect(appiumService.findElement({ matcher }))
    .resolves.toEqual(ref);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/element`,
    payload: matcher
  });
});

it("makes a POST request to the 'Find Element From Element' Appium endpoint when 'element' is passed", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock({ elementId: "elementId" });
  const ref2 = createFindElementMock({ elementId: "elementId2" });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(ref2);

  await expect(appiumService.findElement({ matcher, element: ref }))
    .resolves.toEqual(ref2);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/element`,
    payload: matcher
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const ref = createFindElementMock({ elementId: "elementId" });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(ref);

  await expect(appiumService.findElement({ sessionId, matcher }))
    .resolves.toEqual(ref);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/element`,
    payload: matcher
  });
});