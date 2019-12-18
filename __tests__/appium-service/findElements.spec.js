jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock, createFindElementsMock } = require("../appiumServiceMocks");
const { by } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("makes a POST request to the 'Find Elements' Appium endpoint", async () => {
  const sessionId = "sessionId";
  const refs = createFindElementsMock({ elementIds: ["elementId", "elementId2", "elementId3"] });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(refs);

  await expect(appiumService.findElements({ matcher }))
    .resolves.toEqual(refs);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/elements`,
    payload: matcher
  });
});

it("makes a POST request to the 'Find Elements From Element' Appium endpoint when 'element' is passed", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock({ elementId: "elementId" });
  const refs = createFindElementsMock({ elementIds: ["elementId2", "elementId3", "elementId4"] });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(refs);

  await expect(appiumService.findElements({ matcher, element: ref }))
    .resolves.toEqual(refs);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/elements`,
    payload: matcher
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const refs = createFindElementsMock({ elementIds: ["elementId", "elementId2", "elementId3"] });
  const matcher = by.label("list-item");
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(refs);

  await expect(appiumService.findElements({ sessionId, matcher }))
    .resolves.toEqual(refs);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "POST",
    path: `/session/${sessionId}/elements`,
    payload: matcher
  });
});