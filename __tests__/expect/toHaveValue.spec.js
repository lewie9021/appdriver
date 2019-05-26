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
  appiumServer.mockElementValue({elementId: "elementId", value: "Hello World!"});

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue("Hello World!"))
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  const actualValue = "Hello!";
  const expectedValue = "Hello World!";

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeStaticText"});
  appiumServer.mockElementValue({elementId: "elementId", value: actualValue});

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue(expectedValue))
    .rejects.toThrow(new Error(`Expected element to have value '${expectedValue}' but instead got '${actualValue}'.`));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeStaticText"});
  appiumServer.mockElementValue({status: 3, elementId: "elementId"});

  const $element = await element(by.label("text-input"));

  await expect(assert($element).toHaveValue("My Product"))
    .rejects.toThrow(new ElementActionError("Failed to get value for element."));
});