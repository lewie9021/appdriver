jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");
const { createFindElementMock } = require("../appiumServiceMocks");
const { NotSupportedError, AppiumError } = require("../../src/worker/errors");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));

  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(null);

    await appiumService.getElementFocusedAttribute({ element: ref });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/active`
    });
  });

  it("returns true when the active element matches 'element'", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(ref);

    await expect(appiumService.getElementFocusedAttribute({ element: ref }))
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  });

  it("returns false when there's no active element", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    const error = new AppiumError("unable to find an element using '(null)', value '(null)'", 7);
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockRejectedValue(error);

    await expect(appiumService.getElementFocusedAttribute({ element: ref }))
      .resolves.toEqual(false);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  });

  it("returns false when the active element doesn't match 'element'", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock({ elementId: "elementId" });
    const ref2 = createFindElementMock({ elementId: "elementId2" });
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(ref2);

    await expect(appiumService.getElementFocusedAttribute({ element: ref }))
      .resolves.toEqual(false);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue(null);

    await appiumService.getElementFocusedAttribute({ sessionId, element: ref });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/element/active`
    });
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));

  it("makes a GET request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue("false");

    await appiumService.getElementFocusedAttribute({ element: ref });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/sessionId/element/${ref.ELEMENT}/attribute/focused`
    });
  });

  it("returns true when focused", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue("true");

    await expect(appiumService.getElementFocusedAttribute({ element: ref }))
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  });

  it("returns false when unfocused", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock({ elementId: "elementId" });
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue("false");

    await expect(appiumService.getElementFocusedAttribute({ element: ref }))
      .resolves.toEqual(false);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue("false");

    await appiumService.getElementFocusedAttribute({ sessionId, element: ref });

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/element/${ref.ELEMENT}/attribute/focused`
    });
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("throws a NotSupportedError", async () => {
    const sessionId = "sessionId";
    const ref = createFindElementMock();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.getElementFocusedAttribute({ element: ref });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});
