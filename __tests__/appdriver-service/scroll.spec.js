jest.mock("../../src/worker/services/appiumService");
jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const appdriverService = require("../../src/worker/services/appdriverService");
const { setPlatform } = require("../helpers");
const gestures = require("../../src/worker/gestures");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const runNativeTests = () => {
  it("calls the performActions method on the Appium service", async () => {
    const sessionId = "sessionId";
    const x = 100;
    const y = 200;
    const direction = 180;
    const distance = 300;
    const actions = await gestures.scroll({ x, y, direction, distance }).resolve();
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(appiumService, "performActions").mockResolvedValue();

    await expect(appdriverService.scroll({ x, y, direction, distance }))
      .resolves.toEqual(undefined);

    expect(appiumService.performActions).toHaveBeenCalledTimes(1);
    expect(appiumService.performActions).toHaveBeenCalledWith({ sessionId, actions });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(appiumService, "performActions").mockResolvedValue();

    await expect(appdriverService.scroll({ sessionId, x: 50, y: 200, direction: 0, distance: 100 }))
      .resolves.toEqual(undefined);

    expect(appiumService.performActions).toHaveBeenCalledTimes(1);
    expect(appiumService.performActions).toHaveBeenCalledWith(expect.objectContaining({ sessionId }));
  });
};

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));
  runNativeTests();
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));
  runNativeTests();
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("calls the execute method on the Appium service", async () => {
    const sessionId = "sessionId";
    const distance = 300;
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(appiumService, "execute").mockResolvedValue();

    await expect(appdriverService.scroll({ x: 100, y: 200, direction: 180, distance }))
      .resolves.toEqual(undefined);

    expect(appiumService.execute).toHaveBeenCalledTimes(1);
    expect(appiumService.execute).toHaveBeenCalledWith({
      sessionId,
      script: "window.scrollBy(arguments[0], arguments[1])",
      args: [ 0, distance ]
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(appiumService, "execute").mockResolvedValue();

    await expect(appdriverService.scroll({ sessionId, x: 50, y: 200, direction: 0, distance: 100 }))
      .resolves.toEqual(undefined);

    expect(appiumService.execute).toHaveBeenCalledTimes(1);
    expect(appiumService.execute).toHaveBeenCalledWith(expect.objectContaining({ sessionId }));
  });
});