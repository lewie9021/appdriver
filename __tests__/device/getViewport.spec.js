jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { device } = require("../../index.js");
const { createSessionWindowRectFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns the device viewport width and height", async () => {
  const width = 640;
  const height = 480;
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({width, height}));

  const result = await device.getViewport();

  expect(result).toEqual({width, height});
  expect(commands.session.getWindowRect).toHaveBeenCalledTimes(1);
});

it("correctly handles session window rect request errors", async () => {
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({status: 3}));

  await expect(device.getViewport())
    .rejects.toThrow(new Error("Failed to get device viewport."));

  expect(commands.session.getWindowRect).toHaveBeenCalledTimes(1);
});