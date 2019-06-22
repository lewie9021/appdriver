const appiumServer = require("../helpers/appiumServer");

const { by, element, expect: assert } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("doesn't throw if expectation is met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const $element = await element(by.label("button"));

  await expect(assert($element).toExist())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({status: 3, elementId: "elementId"});

  const $element = await element(by.label("button"));

  await expect(assert($element).toExist())
    .rejects.toThrow(new Error("Expected element to exist."));
});