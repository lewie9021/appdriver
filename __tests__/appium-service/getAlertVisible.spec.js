jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const requestHelpers = require("../../src/worker/services/request");
const { AppiumError } = require("../../src/worker/errors");
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

    await expect(appiumService.getAlertVisible())
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
  });

  it("returns false when no alert is present", async () => {
    const sessionId = "sessionId";
    const error = new AppiumError("No alert present", 27);
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockRejectedValue(error);

    await expect(appiumService.getAlertVisible())
      .resolves.toEqual(false);

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

    await expect(appiumService.getAlertVisible({ sessionId }))
      .resolves.toEqual(true);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "GET",
      path: `/session/${sessionId}/alert/text`
    });
  });

  it("optionally accepts text to assert a particular alert is present", async () => {
    const sessionId = "sessionId";
    const text = [
      "Alert Title",
      "Alert Message"
    ].join("\n");
    const alertText = [
      "Another Alert Title",
      "Another Alert Message"
    ].join("\n");
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue(alertText);

    await expect(appiumService.getAlertVisible({ text }))
      .resolves.toEqual(false);

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