jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the 'deviceName' session capability", async () => {
  const deviceName = "iPhone X";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(deviceName);

  expect(device.name).toEqual(deviceName);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("deviceName");
});