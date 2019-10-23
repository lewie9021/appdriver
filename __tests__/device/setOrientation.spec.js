const appiumServer = require("../helpers/appiumServer");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("sets the device orientation (portrait)", async () => {
  const orientation = "PORTRAIT";

  const setOrientationMock = appiumServer.mockSetOrientation();

  await device.setOrientation(orientation);

  const setOrientationMockCalls = appiumServer.getCalls(setOrientationMock);

  expect(setOrientationMockCalls).toHaveLength(1);
  expect(setOrientationMockCalls[0].options.body).toEqual({ orientation });
});

it("sets the device orientation (landscape)", async () => {
  const orientation = "LANDSCAPE";

  const setOrientationMock = appiumServer.mockSetOrientation();

  await device.setOrientation(orientation);

  const setOrientationMockCalls = appiumServer.getCalls(setOrientationMock);

  expect(setOrientationMockCalls).toHaveLength(1);
  expect(setOrientationMockCalls[0].options.body).toEqual({ orientation });
});

it("correctly handles set orientation request errors", async () => {
  const getOrientationMock = appiumServer.mockSetOrientation({ status: 3 });

  await expect(device.setOrientation())
    .rejects.toThrow(new Error("Failed to set device orientation."));

  const getOrientationMockCalls = appiumServer.getCalls(getOrientationMock);

  expect(getOrientationMockCalls).toHaveLength(1);
});