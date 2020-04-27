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
      ? Promise.resolve()
      : Promise.reject(error);
  });
};

it("polls 'conditionFn' until it resolves", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));

  setConfig({ waitForInterval: 50, waitForTimeout: 2000 });

  await device.waitFor(conditionFn);

  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("throws a WaitError if the polling times out", async () => {
  const conditionFn = createConditionFn(Infinity, new Error("Test"));
  const timeout = 2000;
  const interval = 50;

  setConfig({ waitForInterval: interval, waitForTimeout: timeout });
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

  setConfig({ waitForInterval: interval, waitForTimeout: 2000 });
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

  setConfig({ waitForInterval: 50, waitForTimeout: timeout });
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
