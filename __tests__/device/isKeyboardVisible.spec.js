const appiumServer = require("../helpers/appiumServer");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns true when the keyboard is visible", async () => {
  const isKeyboardShownMock = appiumServer.mockIsKeyboardShown({shown: true});

  const result = await device.isKeyboardVisible();

  expect(result).toEqual(true);
  expect(appiumServer.getCalls(isKeyboardShownMock)).toHaveLength(1);
});

it("returns false when the keyboard isn't visible", async () => {
  const isKeyboardShownMock = appiumServer.mockIsKeyboardShown({shown: false});

  const result = await device.isKeyboardVisible();

  expect(result).toEqual(false);
  expect(appiumServer.getCalls(isKeyboardShownMock)).toHaveLength(1);
});

it("correctly handles keyboard visibility request errors", async () => {
  const isKeyboardShownMock = appiumServer.mockIsKeyboardShown({status: 3});

  await expect(device.isKeyboardVisible())
    .rejects.toThrow(new Error("Failed to get keyboard visibility status."));

  expect(appiumServer.getCalls(isKeyboardShownMock)).toHaveLength(1);
});