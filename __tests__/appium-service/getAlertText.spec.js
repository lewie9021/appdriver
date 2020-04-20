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
  it("makes a GET request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const alertText = [
      "Alert Title",
      "Alert Message"
    ].join("\n");
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(alertText);

    await expect(appiumService.getAlertText())
      .resolves.toEqual(alertText);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const alertText = [
      "Alert Title",
      "Alert Message"
    ].join("\n");
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue(alertText);

    await expect(appiumService.getAlertText({ sessionId }))
      .resolves.toEqual(alertText);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/alert/text`
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