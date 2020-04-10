jest.mock("../../src/stores/configStore");

const { configStore } = require("../../src/stores/configStore");
const { WaitError } = require("../../src/worker/errors");
const { device } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const createConditionFn = (maxPollCount, error) => {
  let pollCount = 0;

  return jest.fn(() => {
    pollCount += 1;

    return pollCount >= maxPollCount
      ? Promise.resolve()
      : Promise.reject(error);
  });
};

it("polls 'conditionFn' until it resolves", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);

  await device.waitFor(conditionFn);

  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("throws a WaitError if the polling times out", async () => {
  const conditionFn = createConditionFn(Infinity, new Error("Test"));
  const timeout = 2000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  expect.assertions(2);

  try {
    await device.waitFor(conditionFn);
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Wait condition exceeded ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const interval = 50;
  const conditionFn = createConditionFn(Infinity, new Error("Test"));

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  expect.assertions(2);

  try {
    await device.waitFor(conditionFn, { maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Wait condition exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }
});

it("supports passing a 'interval' parameter", async () => {
  const interval = 100;
  const timeout = 2000;
  const conditionFn = createConditionFn(Infinity, new Error("Test"));

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  expect.assertions(2);

  try {
    await device.waitFor(conditionFn, { interval });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Wait condition exceeded ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }
});
