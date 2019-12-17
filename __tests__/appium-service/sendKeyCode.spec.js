jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { NotImplementedError } = require("../../src/worker/errors");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Android", () => {
  beforeEach(() => {
    jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("Android");
  });

  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const keycode = 66;
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.sendKeyCode({ keycode }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/appium/device/press_keycode`,
      payload: { keycode }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const keycode = 67;
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.sendKeyCode({ sessionId, keycode }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/appium/device/press_keycode`,
      payload: { keycode }
    });
  });
});

describe("iOS", () => {
  beforeEach(() => {
    jest.spyOn(sessionStore, "getCapabilities").mockReturnValue("iOS");
  });

  it("throws a NotImplementedError", async () => {
    const sessionId = "sessionId";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.sendKeyCode({ keycode: 66 });
    } catch (err) {
      expect(err).toBeInstanceOf(NotImplementedError);
      expect(err).toHaveProperty("message", "Functionality not implemented.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});