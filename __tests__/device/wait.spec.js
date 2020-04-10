const { device } = require("../../main");

it("delays the test script for the given duration (ms)", () => {
  jest.useFakeTimers();

  const duration = 200;

  device.wait(duration);

  jest.runOnlyPendingTimers();

  expect(global.setTimeout).toHaveBeenCalledTimes(1);
  expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), duration);
});