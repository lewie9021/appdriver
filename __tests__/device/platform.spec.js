jest.mock("../../src/worker/stores/sessionStore");

const { sessionStore } = require("../../src/worker/stores/sessionStore");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns the 'platformName' and 'platformVersion' session capabilities", async () => {
  const platformName = "Android";
  const platformVersion = "9.1";

  jest.spyOn(sessionStore, "getCapabilities").mockReturnValue({ platformName, platformVersion });

  expect(device.platform).toEqual({ name: platformName, version: platformVersion });
  expect(sessionStore.getCapabilities).toHaveBeenCalledWith();
});