const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

const { element, by } = require("../../");
const { Element } = require("../../src/Element");
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

jest.setTimeout(100000);

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  const $element = await element(by.label("button")).waitToBeInvisible();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual("elementId");
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToBeInvisible();

  expect($newElement).not.toBe($element);
});

it("polls for visibility up to 5 seconds before throwing", async () => {
  const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementDisplayedMock = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  await expect(element(by.label("button")).waitToBeInvisible())
    .rejects.toThrow(new Error("Element still visible after 5000ms timeout (interval: 200ms)."));

  expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementDisplayedMock)).toHaveLength(26);
});

it("attempts to find the element before checking visibility if receives an ElementNotFound error", async () => {
  const elementNotFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementNotDisplayed = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  expect(fetch).toHaveBeenCalledTimes(0);

  await expect(element(by.label("button")).waitToBeInvisible())
    .rejects.toThrow(new Error("Element still visible after 5000ms timeout (interval: 200ms)."));

  expect(appiumServer.getCalls(elementNotFoundMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(26);
  expect(appiumServer.getCalls(elementNotDisplayed)).toHaveLength(26);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions({ status: 3 });
  appiumServer.mockElementDisplayed({ elementId: "elementId", displayed: false });

  const result = element(by.label("button"))
    .tap()
    .waitToBeInvisible();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

describe("maxDuration parameter", () => {
  it("customises how long to poll before throwing", async () => {
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementDisplayedMock = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitToBeInvisible({maxDuration}))
      .rejects.toThrow(new ElementActionError(`Element still visible after ${maxDuration}ms timeout (interval: 200ms).`));

    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementDisplayedMock)).toHaveLength(11);
  });

  it("is factored into cases where the element doesn't initially exist", async () => {
    const elementNotFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementDisplayedMock = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitToBeInvisible({maxDuration}))
      .rejects.toThrow(new ElementActionError(`Element still visible after ${maxDuration}ms timeout (interval: 200ms).`));

    expect(appiumServer.getCalls(elementNotFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(11);
    expect(appiumServer.getCalls(elementDisplayedMock)).toHaveLength(11);
  }, 10000);
});

// TODO: Needs better coverage than just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementDisplayedMock = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});
    const interval = 1000;

    await expect(element(by.label("button")).waitToBeInvisible({interval}))
      .rejects.toThrow(new ElementActionError(`Element still visible after 5000ms timeout (interval: ${interval}ms).`));

    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementDisplayedMock)).toHaveLength(6);
  });

  it("is factored into the request polling if the element doesn't initially exist", async () => {
    const elementNotFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementDisplayedMock = appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});
    const interval = 1000;

    await expect(element(by.label("button")).waitToBeInvisible({interval}))
      .rejects.toThrow(new ElementActionError(`Element still visible after 5000ms timeout (interval: ${interval}ms).`));

    expect(appiumServer.getCalls(elementNotFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(6);
    expect(appiumServer.getCalls(elementDisplayedMock)).toHaveLength(6);
  }, 10000);
});