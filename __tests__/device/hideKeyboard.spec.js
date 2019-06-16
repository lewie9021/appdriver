const appiumServer = require("../helpers/appiumServer");
const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("hides the keyboard", async () => {
  const hideKeyboardMock = appiumServer.mockHideKeyboard();

  await device.hideKeyboard();

  expect(appiumServer.getCalls(hideKeyboardMock)).toHaveLength(1);
});

it("correctly handles hide keyboard request errors", async () => {
  const hideKeyboardMock = appiumServer.mockHideKeyboard({status: 3});

  await expect(device.hideKeyboard())
    .rejects.toThrow(new Error("Failed to hide keyboard."));

  expect(appiumServer.getCalls(hideKeyboardMock)).toHaveLength(1);
});