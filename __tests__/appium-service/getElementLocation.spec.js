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

it("makes a GET request to the 'Element Location' Appium endpoint", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock();
  const location = { x: 0, y: 50 };
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(location);

  await expect(appiumService.getElementLocation({ element: ref }))
    .resolves.toEqual(location);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/location`
  });
});

it("makes a GET request to the 'Element Location in View' Appium endpoint when 'relative' is passed", async () => {
  const sessionId = "sessionId";
  const ref = createFindElementMock();
  const location = { x: 100, y: 200 };
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
  jest.spyOn(requestHelpers, "request").mockResolvedValue(location);

  await expect(appiumService.getElementLocation({ element: ref, relative: true }))
    .resolves.toEqual(location);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/location_in_view`
  });
});

it("optionally accepts a sessionId", async () => {
  const sessionId = "newSessionId";
  const ref = createFindElementMock();
  const location = { x: 200, y: 0 };
  jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
  jest.spyOn(requestHelpers, "request").mockResolvedValue(location);

  await expect(appiumService.getElementLocation({ sessionId, element: ref }))
    .resolves.toEqual(location);

  expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  expect(requestHelpers.request).toHaveBeenCalledWith({
    method: "GET",
    path: `/session/${sessionId}/element/${ref.ELEMENT}/location`
  });
});