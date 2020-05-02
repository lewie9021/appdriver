jest.mock("../../src/worker/services/request");
jest.mock("../../src/worker/stores/sessionStore");

const requestHelpers = require("../../src/worker/services/request");
const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { appiumService } = require("../../src/worker/services/appiumService");
const { NotSupportedError } = require("../../src/worker/errors");
const { setPlatform } = require("../helpers");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const runNativeTests = () => {
  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const script = "mobile:getDeviceTime";
    const args = [{ format: "YYYY-MM" }];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ script, args }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script,
        args
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const script = "mobile:getDeviceTime";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ sessionId, script }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script,
        args: []
      }
    });
  });
};

describe("iOS", () => {
  beforeEach(() => setPlatform("iOS"));
  runNativeTests();

  it("throws a NotSupportedError when a function is passed", async () => {
    const sessionId = "sessionId";
    const script = (a, b) => a + b;
    const args = [ 1, 2 ];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.execute({ script, args });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functions are only supported in the Web context.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});

describe("Android", () => {
  beforeEach(() => setPlatform("Android"));
  runNativeTests();

  it("throws a NotSupportedError when a function is passed", async () => {
    const sessionId = "sessionId";
    const script = (a, b) => a + b;
    const args = [ 1, 2 ];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();
    expect.assertions(3);

    try {
      await appiumService.execute({ script, args });
    } catch (err) {
      expect(err).toBeInstanceOf(NotSupportedError);
      expect(err).toHaveProperty("message", "Functions are only supported in the Web context.");
    }

    expect(requestHelpers.request).not.toHaveBeenCalled();
  });
});

describe("Web", () => {
  beforeEach(() => setPlatform("Web"));

  it("makes a POST request to the correct Appium endpoint", async () => {
    const sessionId = "sessionId";
    const script = "return arguments[0] * 2";
    const args = [5];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ script, args }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script,
        args
      }
    });
  });

  it("optionally accepts a sessionId", async () => {
    const sessionId = "newSessionId";
    const script = "return 1 + 2";
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue("sessionId");
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ sessionId, script }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script,
        args: []
      }
    });
  });

  it("prepends 'return' when a string is passed without one", async () => {
    const sessionId = "sessionId";
    const script = "arguments[0] + arguments[1]";
    const args = [ 1, 2 ];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ script, args }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script: `return ${script.trim()}`,
        args
      }
    });
  });

  it("supports passing a function to 'script'", async () => {
    const sessionId = "sessionId";
    const script = (a, b) => a + b;
    const args = [ 1, 2 ];
    jest.spyOn(sessionStore, "getSessionId").mockReturnValue(sessionId);
    jest.spyOn(requestHelpers, "request").mockResolvedValue();

    await expect(appiumService.execute({ script, args }))
      .resolves.toEqual(undefined);

    expect(requestHelpers.request).toHaveBeenCalledTimes(1);
    expect(requestHelpers.request).toHaveBeenCalledWith({
      method: "POST",
      path: `/session/${sessionId}/execute`,
      payload: {
        script: `return (${script}).apply(null, arguments)`,
        args
      }
    });
  });
});