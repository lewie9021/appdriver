const appiumServer = require("../helpers/appiumServer");

jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

const { by, element, expect: assert } = require("../../");
const { ElementActionError } = require("../../src/errors");

beforeEach(() => {
  mockSession({
    sessionId: "sessionId",
    platformName: "iOS"
  });
});

afterEach(() => {
  appiumServer.resetMocks();
});

it("doesn't throw if expectation is met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeStaticText"});
  appiumServer.mockElementText({elementId: "elementId", text: "My Product"});

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText("My Product"))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  const actualText = "My Other Product";
  const expectedText = "My Product";

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeStaticText"});
  appiumServer.mockElementText({elementId: "elementId", text: actualText});

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText(expectedText))
    .rejects.toThrow(new Error(`Expected element to have text '${expectedText}' but instead got '${actualText}'.`));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeStaticText"});
  appiumServer.mockElementText({status: 3, elementId: "elementId"});

  const $element = await element(by.label("product-title"));

  await expect(assert($element).toHaveText("My Product"))
    .rejects.toThrow(new ElementActionError("Failed to get text for element."));
});