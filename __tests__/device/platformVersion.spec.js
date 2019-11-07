jest.mock("../../src/stores/sessionStore");

const { sessionStore } = require("../../src/stores/sessionStore");
const { device } = require("../../");

afterEach(() => {
  jest.restoreAllMocks();
});

it("returns the 'platformVersion' session capability", async () => {
  const platformVersion = "iPhone X";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue(platformVersion);

  expect(device.platformVersion).toEqual(platformVersion);
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith("platformVersion");
});