const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the device viewport width and height", async () => {
  const width = 640;
  const height = 480;

  appiumServer.mockWindowRect({width, height});

  const result = await device.getViewport();

  expect(result).toEqual({width, height});
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("correctly handles session window rect request errors", async () => {
  appiumServer.mockWindowRect({status: 3});

  await expect(device.getViewport())
    .rejects.toThrow(new Error("Failed to get device viewport."));

  expect(fetch).toHaveBeenCalledTimes(1);
});