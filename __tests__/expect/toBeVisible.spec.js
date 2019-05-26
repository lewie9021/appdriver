const appiumServer = require("../helpers/appiumServer");

const { by, element, expect: assert } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("doesn't throw if expectation is met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: false});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .rejects.toThrow(new Error("Expected element to be visible but instead got 'false'."));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({status: 3, elementId: "elementId"});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeVisible())
    .rejects.toThrow(new ElementActionError("Failed to get visibility status of element."));
});