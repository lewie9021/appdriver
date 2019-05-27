const { device } = require("../../");
const mockSession = require("../helpers/mockSession");

it("returns name of device from session (iOS simulator)", () => {
  const deviceName = "iPhone X";

  mockSession({
    sessionId: "sessionId",
    platformName: "iOS",
    deviceName
  });

  expect(device.name).toEqual(deviceName);
});

it("returns name of device from session (Android emulator)", () => {
  const deviceName = "Pixel_2_API_27";

  mockSession({
    sessionId: "sessionId",
    platformName: "Android",
    deviceName
  });

  expect(device.name).toEqual(deviceName);
});