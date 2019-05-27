const { device } = require("../../");

jest.useFakeTimers();

it("delays the test script for the given duration (ms)", async () => {
  const duration = 200;

  device.wait(duration);

  jest.runOnlyPendingTimers();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(
    expect.any(Function),
    duration
  );
});