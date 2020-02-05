jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { AppiumError, ActionError } = require("../../src/worker/errors");
const { device } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("executes the 'setContext' method on the Appium Service", async () => {
  const webContext = { id: "WEBVIEW_41490.2", title: "Google", url: "https://google.com" };
  const contexts = [ { id: "NATIVE_APP", title: null, url: null }, webContext ];

  jest.spyOn(appiumService, "getContexts").mockResolvedValue(contexts);
  jest.spyOn(appiumService, "setContext").mockResolvedValue(null);

  await device.switchToWebContext();

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
  expect(appiumService.setContext).toHaveBeenCalledTimes(1);
  expect(appiumService.setContext).toHaveBeenCalledWith({ contextId: webContext.id });
});

it("throws if there are multiple web contexts found", async () => {
  const webContextOne = { id: "WEBVIEW_41490.2", title: "Google", url: "https://google.com" };
  const webContextTwo = { id: "WEBVIEW_41490.3", title: "Appium", url: "http://appium.io/" };
  const contexts = [ { id: "NATIVE_APP", title: null, url: null }, webContextOne, webContextTwo ];

  jest.spyOn(appiumService, "getContexts").mockResolvedValue(contexts);
  jest.spyOn(appiumService, "setContext").mockResolvedValue(null);
  expect.assertions(4);

  try {
    await device.switchToWebContext();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Multiple Web contexts found. Consider using the .switchContext method.");
  }

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
  expect(appiumService.setContext).toHaveBeenCalledTimes(0);
});

it("throws an ActionError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "getContexts").mockRejectedValue(error);
  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await device.switchToWebContext();
  } catch (err) {
    expect(err).toBeInstanceOf(ActionError);
    expect(err).toHaveProperty("message", "Failed to switch to the Web context.");
  }

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
  expect(appiumService.setContext).toHaveBeenCalledTimes(0);
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "getContexts").mockRejectedValue(error);
  jest.spyOn(appiumService, "setContext").mockRejectedValue(error);
  expect.assertions(4);

  try {
    await device.switchToWebContext();
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }

  expect(appiumService.getContexts).toHaveBeenCalledTimes(1);
  expect(appiumService.setContext).toHaveBeenCalledTimes(0);
});