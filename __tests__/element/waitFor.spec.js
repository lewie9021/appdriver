jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementNotFoundError, ElementActionError, AppiumError } = require("../../src/errors");
const { Element } = require("../../src/Element");
const { element, by, expect } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const createConditionFn = (maxPollCount, error) => {
  let pollCount = 0;

  return jest.fn(() => {
    pollCount +=1;

    return pollCount >= maxPollCount
      ? Promise.resolve()
      : Promise.reject(error);
  });
};

it("returns an instance of Element to enable function chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  const $element = await element(by.label("input")).waitFor(() => Promise.resolve());

  expect($element).toBeInstanceOf(Element);
});

it("polls 'conditionFn' until it resolves when there's an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("forwards the new element value once resolved when there's an element reference", async() => {
  const totalPollCount = 3;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const ref = createFindElementMock();
  const matcher = by.label("input");

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);

  const result = await element(matcher).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
  await expect(result.value).resolves.toEqual({ ref, matcher });
});

it("polls 'conditionFn' until it resolves when there isn't an element reference", async () => {
  const totalPollCount = 5;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  await element(by.label("input")).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
});

it("forwards the new element value once resolved when there isn't an element reference", async () => {
  const totalPollCount = 3;
  const conditionFn = createConditionFn(totalPollCount, new Error("Test"));
  const error = new AppiumError("Request error.", 3);
  const matcher = by.label("input");

  jest.spyOn(appiumService, "findElement").mockRejectedValue(error);

  const result = await element(matcher).waitFor(conditionFn);

  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(conditionFn).toHaveBeenCalledTimes(totalPollCount);
  await expect(result.value).resolves.toEqual({ ref: null, matcher });
});

it.todo("supports passing a 'maxDuration' parameter");

it.todo("supports passing a 'interval' parameter");

it.todo("throws an ElementWaitError if the polling times out");

it.todo("propagates errors from further up the chain");

it.todo("propagates other types of errors");

/*
it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({ elementId: "elementId" });
  appiumServer.mockActions({ status: 3 });

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

    await expect(result).rejects.toThrow(new ElementActionError("Wait condition exceeded 5000ms timeout (interval: 200ms)."));
    expect(conditionFn).toHaveBeenCalledTimes(26);  // 5000 / 200 = 25.
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

    await expect(result).rejects.toThrow(new ElementActionError("Wait condition exceeded 5000ms timeout (interval: 200ms)."));
    expect(conditionFn.mock.calls.length).toBeLessThanOrEqual(26); // 5000 / 200 = 25.
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("supports re-implementing .waitToNotExist", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});

    const result = element(by.label("button"))
      .waitFor(($e) => assert($e.exists()).toEqual(false));

    await expect(result).resolves.toBeInstanceOf(Element);
    expect(fetch).toHaveBeenCalledTimes(3);
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
      .rejects.toThrow(new ElementActionError(`Wait condition exceeded ${maxDuration}ms timeout (interval: 200ms).`));

    expect(conditionFn).toHaveBeenCalledTimes((maxDuration / 200) + 1);
  });
});

describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const conditionFn = jest.fn(() => Promise.reject());
    const interval = 1000;

    await expect(element(by.label("button")).waitFor(conditionFn, {interval}))
      .rejects.toThrow(new ElementActionError(`Wait condition exceeded 5000ms timeout (interval: ${interval}ms).`));

    expect(conditionFn).toHaveBeenCalledTimes((5000 / interval) + 1);
  });
});
 */