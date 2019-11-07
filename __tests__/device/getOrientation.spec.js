jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { AppiumError } = require("../../src/errors");
const { device } = require("../../");

afterEach(() => {
  jest.restoreAllMocks();
});

it("returns the device orientation", async () => {
  const orientation = "PORTRAIT";
  jest.spyOn(appiumService, "getOrientation").mockResolvedValue(orientation);

  const result = await device.getOrientation();

  expect(result).toEqual(orientation);
  expect(appiumService.getOrientation).toHaveBeenCalled();
});

it("correctly handles get orientation request errors", async () => {
  const error = new AppiumError("Request error.", 3);
  jest.spyOn(appiumService, "getOrientation").mockRejectedValue(error);

  await expect(device.getOrientation())
    .rejects.toThrow(error);

  expect(appiumService.getOrientation).toHaveBeenCalled();
});