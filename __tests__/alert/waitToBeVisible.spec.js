jest.mock("../../src/worker/services/appiumService");
jest.mock("../../src/stores/configStore");

const { appiumService } = require("../../src/worker/services/appiumService");
const { WaitError } = require("../../src/worker/errors");
const { setConfig } = require("../helpers");
const { alert } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("polls alert visibility status until it resolves", async () => {
  setConfig({ waitForInterval: 50, waitForTimeout: 2000 });
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValueOnce(false);
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValueOnce(true);

  await alert.waitToBeVisible();

  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(3);
});

it("throws a WaitError if the polling times out", async () => {
  const timeout = 1000;
  const interval = 50;

  setConfig({ waitForInterval: interval, waitForTimeout: timeout });
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await alert.waitToBeVisible();
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Alert not visible after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.getAlertVisible).toHaveBeenCalled();
});

it("supports passing a 'maxDuration' parameter", async () => {
  const maxDuration = 1000;
  const interval = 50;

  setConfig({ waitForInterval: interval, waitForTimeout: 2000 });
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await alert.waitToBeVisible({ maxDuration });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Alert not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.getAlertVisible).toHaveBeenCalled();
});

it("supports passing a 'interval' parameter", async () => {
  const timeout = 2000;
  const interval = 100;

  setConfig({ waitForInterval: 50, waitForTimeout: timeout });
  jest.spyOn(appiumService, "getElementVisibleAttribute").mockResolvedValue(false);
  expect.assertions(3);

  try {
    await alert.waitToBeVisible({ interval });
  } catch (err) {
    expect(err).toBeInstanceOf(WaitError);
    expect(err).toHaveProperty(
      "message",
      `Alert not visible after ${timeout}ms timeout (interval: ${interval}ms).`
    );
  }

  expect(appiumService.getAlertVisible).toHaveBeenCalled();
});