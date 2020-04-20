jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const runTests = () => {
  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.setAlertValue({ value }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/alert/text`,
      payload: { text: value }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const value = "Hello World!";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.setAlertValue({ sessionId, value }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/alert/text`,
      payload: { text: value }
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
  runTests();
});