jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");
const { setPlatform } = require("../helpers");
const { createFindElementMock } = require("../appiumServiceMocks");
const { NotSupportedError } = require("../../src/worker/errors");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const runTests = () => {
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
};

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));
  runTests();
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));
  runTests();
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
      await appiumService.getElementVisibleAttribute({ element: ref });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});