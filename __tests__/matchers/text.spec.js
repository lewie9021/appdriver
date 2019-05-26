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
  const result = by.text("Press Me!");

  expect(result).toHaveProperty("resolve");
});

describe("iOS", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });
  });

  it("supports fetching a single matching element", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const text = "Press Me!";

    const matcher = by.text(text);
    await matcher.resolve();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: `label = '${text}'`,
        })
      })
    );
  });

  it("supports fetching multiple matching elements", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});
    const text = "Press Me!";

    const matcher = by.text(text);
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: `label = '${text}'`,
        })
      })
    );
  });

  it("supports fetching elements starting with the given text", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.text("Test*");
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: `label BEGINSWITH 'Test'`,
        })
      })
    );
  });

  it("supports fetching elements containing the given text", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.text("*Test*");
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-ios predicate string",
          value: `label CONTAINS 'Test'`,
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

  it("supports fetching a single matching element", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    const text = "Press Me!";

    const matcher = by.text(text);
    await matcher.resolve();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: `new UiSelector().text("${text}")`,
        })
      })
    );
  });

  it("supports fetching multiple matching elements", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});
    const text = "Press Me!";

    const matcher = by.text(text);
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: `new UiSelector().text("${text}")`,
        })
      })
    );
  });

  it("supports fetching elements starting with the given text", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.text("Test*");
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: `new UiSelector().textStartsWith("Test")`,
        })
      })
    );
  });

  it("supports fetching elements containing the given text", async () => {
    appiumServer.mockFindElements({elements: ["element-0", "element-1"]});

    const matcher = by.text("*Test*");
    await matcher.resolve(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          using: "-android uiautomator",
          value: `new UiSelector().textContains("Test")`,
        })
      })
    );
  });
});