const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by, expect: assert } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

jest.setTimeout(6000);

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button")).waitFor(() => Promise.resolve());

  expect($element).toBeInstanceOf(Element);
  expect(fetch).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual("elementId");
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitFor(() => Promise.resolve());

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});

  const result = element(by.label("button"))
    .tap()
    .waitFor(() => Promise.resolve());

  await expect(result).rejects.toThrow(ElementActionError);
});

describe("Element found initially", () => {
  it("polls until 'conditionFn' resolves", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.resolve());
    await element(by.label("button"))
      .waitFor(conditionFn);

    expect(conditionFn).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("calls 'conditionFn' with element", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.resolve());
    await element(by.label("button"))
      .waitFor(conditionFn);

    expect(conditionFn).toHaveBeenCalledTimes(1);
    expect(conditionFn).toHaveBeenCalledWith(expect.any(Element));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("polls until default maxDuration (5000ms) is exceeded if 'conditionFn' rejects", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.reject());
    const result = element(by.label("button"))
      .waitFor(conditionFn);

    await expect(result).rejects.toThrow(new ElementActionError("wait condition exceeded 5000ms timeout (interval: 200ms)."));
    expect(conditionFn).toHaveBeenCalledTimes(25);  // 5000 / 200 = 25.
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("supports re-implementing .waitToExist", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
    appiumServer.mockElementType({status: 3, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(true));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("supports re-implementing .waitToNotExist", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
    appiumServer.mockElementType({status: 3, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("supports re-implementing .waitToBeVisible", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.isVisible()).toEqual(true));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("supports re-implementing .waitToBeInvisible", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.isVisible()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe("Element isn't found initially", () => {
  it("supports re-implementing .waitToExist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({status: 3, elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(true));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it("supports re-implementing .waitToNotExist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({status: 3, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("supports re-implementing .waitToBeVisible", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.isVisible()).toEqual(true));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("supports re-implementing .waitToBeInvisible", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.isVisible()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe("Element is never found", () => {
  it("polls until 'conditionFn' resolves", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.resolve());
    await element(by.label("button"))
      .waitFor(conditionFn);

    expect(conditionFn).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("calls 'conditionFn' with element selector", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.resolve());
    await element(by.label("button"))
      .waitFor(conditionFn);

    expect(conditionFn).toHaveBeenCalledTimes(1);
    expect(conditionFn).toHaveBeenCalledWith(expect.any(Element));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("polls until default maxDuration (5000ms) is exceeded if 'conditionFn' rejects", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const conditionFn = jest.fn(() => Promise.reject());
    const result = element(by.label("button"))
      .waitFor(conditionFn);

    await expect(result).rejects.toThrow(new ElementActionError("wait condition exceeded 5000ms timeout (interval: 200ms)."));
    expect(conditionFn.mock.calls.length).toBeLessThanOrEqual(25); // 5000 / 200 = 25.
    expect(conditionFn).toHaveBeenCalledTimes(25);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("supports re-implementing .waitToNotExist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("supports re-implementing .waitToBeInvisible", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.isVisible()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
  });
});

describe("maxDuration parameter", () => {
  it("customises how long to poll before throwing", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const conditionFn = jest.fn(() => Promise.reject());
    const maxDuration = 2000;

    await expect(element(by.label("button")).waitFor(conditionFn, {maxDuration}))
      .rejects.toThrow(new ElementActionError(`wait condition exceeded ${maxDuration}ms timeout (interval: 200ms).`));

    expect(conditionFn).toHaveBeenCalledTimes(maxDuration / 200);
  });
});

describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const conditionFn = jest.fn(() => Promise.reject());
    const interval = 1000;

    await expect(element(by.label("button")).waitFor(conditionFn, {interval}))
      .rejects.toThrow(new ElementActionError(`wait condition exceeded 5000ms timeout (interval: ${interval}ms).`));

    expect(conditionFn).toHaveBeenCalledTimes(5000 / interval);
  });
});