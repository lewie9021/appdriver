jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the 'platformName' session capability", async () => {
  const platformName = "Android";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(platformName);

  expect(device.platformName).toEqual(platformName);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformName");
});