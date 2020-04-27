jest.mock("../../src/stores/configStore");

const { WaitError } = require("../../src/worker/errors");
const { setConfig } = require("../helpers");
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

  setConfig({ waitForInterval: 50, waitForTimeout: 2000 });

  await device.while(condition, action);

  expect(condition).toHaveBeenCalledTimes(totalPollCount);
  expect(action).toHaveBeenCalledTimes(totalPollCount - 1);
});

it("throws a WaitError if the polling times out", async () => {
  const condition = createConditionFn(Infinity, new Error("Test"));
  const action = jest.fn();
  const timeout = 2000;
  const interval = 50;

  setConfig({ waitForInterval: interval, waitForTimeout: timeout });
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

  setConfig({ waitForInterval: interval, waitForTimeout: 2000 });
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

  setConfig({ waitForInterval: 50, waitForTimeout: timeout });
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
