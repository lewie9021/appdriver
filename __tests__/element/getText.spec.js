const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

const { element, by } = require("../../");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");

const testPlatform = (platformName) => {
  const textElementType = platformName === "iOS"
    ? "XCUIElementTypeStaticText"
    : "android.widget.TextView";

  it("returns the element's text value", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: textElementType});
    appiumServer.mockElementText({elementId: "elementId", text: "Title Text"});

    const result = await element(by.label("product-title")).getText();

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual("Title Text");
  });

  it("correctly propagates errors", async () => {
    appiumServer.mockFindElement({status: 7, elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: textElementType});
    appiumServer.mockElementText({elementId: "elementId", text: "Title Text"});

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(ElementNotFoundError);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("correctly handles text attribute request errors", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: textElementType});
    appiumServer.mockElementText({elementId: "elementId", status: 3});

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(new ElementActionError("Failed to get text for element."));

    expect(fetch).toHaveBeenCalledTimes(3);
  });
};

afterEach(() => {
  appiumServer.resetMocks();
});

describe("iOS", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "iOS"
    });
  });

  testPlatform("iOS");

  it("returns inner text if element isn't directly text", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});
    appiumServer.mockFindElementsFromElement({elementId: "elementId", elements: ["elementId2", "elementId3"]});
    appiumServer.mockElementText({elementId: "elementId", text: ""});
    appiumServer.mockElementText({elementId: "elementId2", text: "Hello"});
    appiumServer.mockElementText({elementId: "elementId3", text: "World!"});

    const result = await element(by.label("product-title")).getText();

    expect(fetch).toHaveBeenCalledTimes(6);
    expect(result).toEqual("Hello World!");
  });
});

describe("Android", () => {
  beforeEach(() => {
    mockSession({
      sessionId: "sessionId",
      platformName: "Android"
    });
  });

  testPlatform("Android");

  it("returns inner text if element isn't directly text", async () => {
    appiumServer.mockFindElement({elementId: "elementId"});
    appiumServer.mockElementType({elementId: "elementId", type: "android.view.ViewGroup"});
    appiumServer.mockFindElementsFromElement({elementId: "elementId", elements: ["elementId2", "elementId3"]});
    appiumServer.mockElementText({elementId: "elementId2", text: "Hello"});
    appiumServer.mockElementText({elementId: "elementId3", text: "World!"});

    const result = await element(by.label("product-title")).getText();

    expect(fetch).toHaveBeenCalledTimes(5);
    expect(result).toEqual("Hello World!");
  });
});