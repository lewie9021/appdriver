const appiumServer = require("../helpers/appiumServer");

const { by, element, expect: assert } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("doesn't throw if expectation is met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementEnabled({elementId: "elementId", enabled: false});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeDisabled())
    .resolves.toBe(undefined);
});

it("throws if expectation is not met", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementEnabled({elementId: "elementId", enabled: true});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeDisabled())
    .rejects.toThrow(new Error("Expected element to be disabled but instead it was enabled."));
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementEnabled({status: 3, elementId: "elementId"});

  const $element = await element(by.label("button"));

  await expect(assert($element).toBeDisabled())
    .rejects.toThrow(new ElementActionError("Failed to retrieve disabled status of element."));
});