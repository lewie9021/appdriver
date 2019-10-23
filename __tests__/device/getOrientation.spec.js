const appiumServer = require("../helpers/appiumServer");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the device orientation (portrait)", async () => {
  const orientation = "PORTRAIT";

  const getOrientationMock = appiumServer.mockGetOrientation({ orientation });

  const result = await device.getOrientation();

  const getOrientationMockCalls = appiumServer.getCalls(getOrientationMock);

  expect(result).toEqual(orientation);
  expect(getOrientationMockCalls).toHaveLength(1);
});

it("returns the device orientation (landscape)", async () => {
  const orientation = "LANDSCAPE";

  const getOrientationMock = appiumServer.mockGetOrientation({ orientation });

  const result = await device.getOrientation();

  const getOrientationMockCalls = appiumServer.getCalls(getOrientationMock);

  expect(result).toEqual(orientation);
  expect(getOrientationMockCalls).toHaveLength(1);
});

it("correctly handles get orientation request errors", async () => {
  const getOrientationMock = appiumServer.mockGetOrientation({ status: 3 });

  await expect(device.getOrientation())
    .rejects.toThrow(new Error("Failed to get device orientation."));

  const getOrientationMockCalls = appiumServer.getCalls(getOrientationMock);

  expect(getOrientationMockCalls).toHaveLength(1);
});