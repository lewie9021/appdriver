jest.mock("../../src/services/appiumService");

const { appiumService } = require("../../src/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, AppiumError } = require("../../src/errors");
const { element, by, expect: assert } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("doesn't throw if expectation is met", async () => {
  const ref = createFindElementMock();
  const text = "Hello World!";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementText").mockResolvedValue(text);

  const $element = await element(by.label("button"));

  await expect(assert($element).toHaveText(text))
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  const ref = createFindElementMock();
  const actualText = "Hello World!";
  const expectedText = "Some Text";

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementText").mockResolvedValue(actualText);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toHaveText(expectedText);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", `Expected element to have text '${expectedText}' but instead got '${actualText}'.`);
  }
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementText").mockRejectedValue(error);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toHaveText("Hello World!");
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to get element text.");
  }
});