const { device } = require("../../");
const mockSession = require("../helpers/mockSession");

it("returns platform version of device from session (iOS simulator)", () => {
  const platformVersion = "12.1";

  mockSession({
    sessionId: "sessionId",
    platformName: "iOS",
    platformVersion
  });

  expect(device.platformVersion).toEqual(platformVersion);
});

it("returns platform version of device from session (Android emulator)", () => {
  const platformVersion = "8.1";

  mockSession({
    sessionId: "sessionId",
    platformName: "Android",
    platformVersion
  });

  expect(device.platformVersion).toEqual(platformVersion);
});