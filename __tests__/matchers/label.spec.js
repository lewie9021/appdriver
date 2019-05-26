const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

const { by } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
  jest.resetAllMocks();
});

it("returns an object containing a resolve method to execute the query", () => {
  const result = by.label("button");

  expect(result).toHaveProperty("resolve");
});

const testPlatform = () => {
  it("supports fetching a single matching element", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const accessibilityLabel = "button";

    const matcher = by.label(accessibilityLabel);
    await matcher.resolve();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "accessibility id",
          value: accessibilityLabel,
        })
      })
    );
  });

  it("supports fetching multiple matching elements", async () => {
    const accessibilityLabel = "button";
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.label(accessibilityLabel);

    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "accessibility id",
          value: accessibilityLabel,
        })
      })
    );
  });
};

describe("iOS", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });
  });

  testPlatform();

  it("supports fetching elements starting with a given accessibility label", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.label("list-item-*");

    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: "name BEGINSWITH 'list-item-'",
        })
      })
    );
  });

  it("supports fetching elements containing the a accessibility label", async () => {
    const accessibilityLabel = "*-item-*";
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.label(accessibilityLabel);

    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: "name CONTAINS '-item-'",
        })
      })
    );
  });
});

describe("Android", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "Android"
    });
  });

  testPlatform();

  it("supports fetching elements starting with a given accessibility label", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.label("list-item-*");

    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: "new UiSelector().descriptionStartsWith(\"list-item-\")",
        })
      })
    );
  });

  it("supports fetching elements containing the a accessibility label", async () => {
    const accessibilityLabel = "*-item-*";
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.label(accessibilityLabel);

    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: "new UiSelector().descriptionContains(\"-item-\")",
        })
      })
    );
  });
});