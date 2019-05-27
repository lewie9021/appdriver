const { device } = require("../../");
const mockSession = require("../helpers/mockSession");

it("returns platform name of device from session (iOS simulator)", () => {
  const platformName = "iOS";

  mockSession({
    sessionId: "sessionId",
    platformName
  });

  expect(device.platformName).toEqual(platformName);
});

it("returns platform name of device from session (Android emulator)", () => {
  const platformName = "Android";

  mockSession({
    sessionId: "sessionId",
    platformName
  });

  expect(device.platformName).toEqual(platformName);
});