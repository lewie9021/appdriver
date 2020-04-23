jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { alert } = require("../../main");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'acceptAlert' method on the Appium Service", async () => {
  const text = [ "Alert", "Hello World!" ].join("\n");

  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);
  jest.spyOn(appiumService, "acceptAlert").mockResolvedValue(null);
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(false);

  await alert.accept();

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalledWith({ text });
});

it("polls the 'getAlertVisible' method on the Appium Service until the alert is hidden", async () => {
  const text = [ "Alert", "Hello World!" ].join("\n");

  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);
  jest.spyOn(appiumService, "acceptAlert").mockResolvedValue(null);
  jest.spyOn(appiumService, "getAlertVisible")
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false);

  await alert.accept();

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(4);
  expect(appiumService.getAlertVisible).toHaveBeenCalledWith({ text });
});

it("throws an ActionError if no alert is present", async () => {
  const error = new AppiumError("No alert present", 27);

  jest.spyOn(appiumService, "getAlertText").mockRejectedValue(error);
  expect.assertions(5);

  try {
    await alert.accept();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to accept alert. No alert present.");
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(0);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(0);
});

it("throws an ActionError if accepting the alert fails", async () => {
  const error = new AppiumError("Request error.", 3);
  const text = [ "Alert", "Hello World!" ].join("\n");

  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);
  jest.spyOn(appiumService, "acceptAlert").mockRejectedValue(error);
  expect.assertions(5);

  try {
    await alert.accept();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to accept alert. Alert still present.");
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(0);
});

it("throws an ActionError if alert is still visible after polling", async () => {
  jest.setTimeout(6000);

  const text = [ "Alert", "Hello World!" ].join("\n");

  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);
  jest.spyOn(appiumService, "acceptAlert").mockResolvedValue(null);
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await alert.accept();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to accept alert. Alert still visible after 5000ms.");
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalled();
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");
  const text = [ "Alert", "Hello World!" ].join("\n");

  jest.spyOn(appiumService, "getAlertText").mockResolvedValue(text);
  jest.spyOn(appiumService, "acceptAlert").mockRejectedValue(error);
  jest.spyOn(appiumService, "getAlertVisible").mockResolvedValue(true);
  expect.assertions(5);

  try {
    await alert.accept();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getAlertText).toHaveBeenCalledTimes(1);
  expect(appiumService.acceptAlert).toHaveBeenCalledTimes(1);
  expect(appiumService.getAlertVisible).toHaveBeenCalledTimes(0);
});