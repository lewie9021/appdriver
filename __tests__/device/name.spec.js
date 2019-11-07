jest.mock("../../src/stores/sessionStore");

const { sessionStore } = require("../../src/stores/sessionStore");
const { device } = require("../../");

afterEach(() => {
  jest.restoreAllMocks();
});

it("returns the session's capabilities.deviceName", async () => {
  const deviceName = "iPhone X";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(deviceName);

  expect(device.name).toEqual(deviceName);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("deviceName");
});