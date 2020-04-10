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
      ? Promise.reject(error)
      : Promise.resolve();
  });
};

it("polls 'action' while 'condition' resolves", async () => {
  const totalPollCount = 5;
  const condition = createConditionFn(totalPollCount, new Error("Test"));
  const action = jest.fn();

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);

  await device.while(condition, action);

  expect(condition).toHaveBeenCalledTimes(totalPollCount);
  expect(action).toHaveBeenCalledTimes(totalPollCount - 1);
});

it("throws a WaitError if the polling times out", async () => {
  const condition = createConditionFn(Infinity, new Error("Test"));
  const action = jest.fn();
  const timeout = 2000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  expect.assertions(2);

  try {
    await device.while(condition, action);
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `While exceeded ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }
});

it("supports passing a 'maxDuration' parameter", async () => {
  const condition = createConditionFn(Infinity, new Error("Test"));
  const action = jest.fn();
  const maxDuration = 1000;
  const interval = 50;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(2000);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(interval);
  expect.assertions(2);

  try {
    await device.while(condition, action, { maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `While exceeded ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }
});

it("supports passing a 'interval' parameter", async () => {
  const condition = createConditionFn(Infinity, new Error("Test"));
  const action = jest.fn();
  const interval = 100;
  const timeout = 2000;

  jest.spyOn(configStore, "getWaitForTimeout").mockReturnValue(timeout);
  jest.spyOn(configStore, "getWaitForInterval").mockReturnValue(50);
  expect.assertions(2);

  try {
    await device.while(condition, action, { interval });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `While exceeded ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }
});
