jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");
const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

beforeEach(() => {
  mockSession({
    sessionId: "sessionId",
    platformName: "iOS"
  });
});

afterEach(() => {
  appiumServer.resetMocks();
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSendKeys({elementId: "elementId"});

  const $element = await element(by.label("text-input")).typeText("Hello World!");

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual("elementId");
});

it("throws action error if 'text' parameter isn't a string", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  await expect(element(by.label("text-input")).typeText())
    .rejects.toThrow(new ElementActionError("Failed to type text. 'text' must be a string, instead got undefined."));

  await expect(element(by.label("text-input")).typeText(1000))
    .rejects.toThrow(new ElementActionError("Failed to type text. 'text' must be a string, instead got number."));
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSendKeys({elementId: "elementId"});

  const $element = await element(by.label("text-input"));
  const $newElement = await $element.typeText("Hello World!");

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSendKeys({status: 3, elementId: "elementId"});
  appiumServer.mockClickElement({elementId: "elementId"});

  const result = element(by.label("text-input"))
    .tap()
    .typeText("Hello World!");

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("throws action error if element doesn't exist", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockElementSendKeys({elementId: "elementId"});

  const result = element(by.label("text-input"))
    .typeText("Hello World!");

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("correctly handles send key request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSendKeys({status: 3, elementId: "elementId"});

  await expect(element(by.label("text-input")).typeText("Hello World!"))
    .rejects.toThrow(new ElementActionError("Failed to type text."));

  expect(fetch).toHaveBeenCalledTimes(2);
});

it("correctly handles case when hardware keyboard is attached on iOS simulator", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSendKeys({status: 13, elementId: "elementId"});

  await expect(element(by.label("text-input")).typeText("Hello World!"))
    .rejects.toThrow(new ElementActionError("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator."));

  expect(fetch).toHaveBeenCalledTimes(2);
});