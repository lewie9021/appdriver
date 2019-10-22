const appiumServer = require("../helpers/appiumServer");
const { NotImplementedError } = require("../../src/errors");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

describe("Android", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "Android"
    });
  });

  it("taps the hardware back button", async () => {
    const backMock = appiumServer.mockBack();

    await device.goBack();

    expect(appiumServer.getCalls(backMock)).toHaveLength(1);
  });

  it("correctly handles back request errors", async () => {
    const backMock = appiumServer.mockBack({status: 3});

    await expect(device.goBack())
      .rejects.toThrow(new Error("Failed to go back."));

    expect(appiumServer.getCalls(backMock)).toHaveLength(1);
  });
});

describe("iOS", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });
  });

  it("throws a not implemented error", async () => {
    const backMock = appiumServer.mockBack();
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });

    await expect(device.goBack())
      .rejects.toThrow(NotImplementedError);

    expect(appiumServer.getCalls(backMock)).toHaveLength(0);
  });
});
