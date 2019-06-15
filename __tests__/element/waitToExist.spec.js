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
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const $element = await element(by.label("button")).waitToExist();

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect($element.value).resolves.toEqual("elementId");
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToExist();

  expect($newElement).not.toBe($element);
});

it("polls for existence up to 5 seconds before throwing", async () => {
  const elementFoundMock = appiumServer.mockFindElement({elementId: "elementId"});
  const elementTypeMock = appiumServer.mockElementType({status: 3, elementId: "elementId"});

  await expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new Error("Element not found after 5000ms timeout (interval: 200ms)."));

  expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(1);
  expect(appiumServer.getCalls(elementTypeMock).length).toBeGreaterThanOrEqual(25);
  expect(appiumServer.getCalls(elementTypeMock).length).toBeLessThanOrEqual(26);
});

it("resolves if element is found", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  await element(by.label("button")).waitToExist();

  expect(fetch).toHaveBeenCalledTimes(5);
});

// TODO!
xit("forwards new element.value if element doesn't exist initially", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const $element = await element(by.label("button")).waitToExist();

  await expect($element.value).resolves.toEqual("elementId");
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const result = element(by.label("button"))
    .tap()
    .waitToExist();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

// TODO: Needs to be improved around number of calls.
describe("maxDuration parameter", () => {
  it("customises how long to poll before throwing", async () => {
    const elementNotFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitToExist({maxDuration}))
      .rejects.toThrow(new ElementActionError(`Element not found after ${maxDuration}ms timeout (interval: 200ms).`));

    expect(appiumServer.getCalls(elementNotFoundMock)).toHaveLength(23);
  });
});

// TODO: Needs better coverage than just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    const elementFoundMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    const interval = 1000;

    await expect(element(by.label("button")).waitToExist({interval}))
      .rejects.toThrow(new ElementActionError(`Element not found after 5000ms timeout (interval: ${interval}ms).`));

    expect(appiumServer.getCalls(elementFoundMock)).toHaveLength(13);
  });
});