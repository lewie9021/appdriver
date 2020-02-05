jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { setPlatform } = require("../helpers");
const requestHelpers = require("../../src/worker/services/request");
const gestures = require("../../src/worker/gestures");
const { NotSupportedError } = require("../../src/worker/errors");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const runTests = () => {
  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const actions = await gestures.tap({ x: 0, y: 0 }).resolve();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.performActions({ actions }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/actions`,
      payload: { actions }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const actions = await gestures.longPress({ x: 0, y: 0 }).resolve();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.performActions({ sessionId, actions }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/actions`,
      payload: { actions }
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
    const actions = await gestures.tap({ x: 0, y: 0 }).resolve();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.performActions({ actions });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functionality not supported.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});