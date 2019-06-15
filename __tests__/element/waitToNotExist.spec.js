const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

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

jest.setTimeout(100000);

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  const $element = await element(by.label("button")).waitToNotExist();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(3);
  await expect($element.value).resolves.toEqual(null);
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToNotExist();

  expect($newElement).not.toBe($element);
});

it("polls for non-existence up to 5 seconds before throwing", async () => {
  const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementTypeMock = appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  await expect(element(by.label("button")).waitToNotExist())
    .rejects.toThrow(new Error("Element still found after 5000ms timeout (interval: 200ms)."));

  expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementTypeMock)).toHaveLength(26);
});

it("resolves if element is not found", async () => {
  const elementFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  await element(by.label("button")).waitToNotExist();

  expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(3);
});

it("resolves if element is found initially and later no longer exists", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
  appiumServer.mockElementType({status: 3, elementId: "elementId"});

  await element(by.label("button")).waitToNotExist();

  expect(fetch).toHaveBeenCalledTimes(5);
});

// TODO!
it.todo("forwards new element.value if element doesn't exist");

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  const result = element(by.label("button"))
    .tap()
    .waitToNotExist();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

// TODO: Needs to be improved around number of calls.
describe("maxDuration parameter", () => {
  it("customises how long to poll before throwing", async () => {
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementTypeMock = appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitToNotExist({maxDuration}))
      .rejects.toThrow(new ElementActionError(`Element still found after ${maxDuration}ms timeout (interval: 200ms).`));

    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementTypeMock)).toHaveLength(11);
  });
});

// TODO: Needs better coverage than just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
    const elementTypeMock = appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
    const interval = 1000;

    await expect(element(by.label("button")).waitToNotExist({interval}))
      .rejects.toThrow(new ElementActionError(`Element still found after 5000ms timeout (interval: ${interval}ms).`));

    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
    expect(appiumServer.getCalls(elementTypeMock)).toHaveLength(6);
  });
});