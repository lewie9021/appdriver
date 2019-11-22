jest.mock("../../src/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the 'platformVersion' session capability", async () => {
  const platformVersion = "12.4";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(platformVersion);

  expect(device.platformVersion).toEqual(platformVersion);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformVersion");
});