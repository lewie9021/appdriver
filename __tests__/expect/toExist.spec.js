jest.mock("../../src/worker/services/appiumService");

const { appiumService } = require("../../src/worker/services/appiumService");
const { createFindElementMock } = require("../appiumServiceMocks");
const { ElementActionError, AppiumError } = require("../../src/worker/errors");
const { element, by, expect: assert } = require("../../");

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("doesn't throw if expectation is met", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(true);

  const $element = await element(by.label("button"));

  await expect(assert($element).toExist())
    .resolves.toEqual(undefined);
});

it("throws if expectation is not met", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockResolvedValue(false);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toExist();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("message", "Expected element to exist.");
  }
});

// TODO: Could maybe wrap the error?
it("correctly propagates errors", async () => {
  const ref = createFindElementMock();
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "getElementExists").mockRejectedValue(error);
  expect.assertions(2);

  try {
    const $element = await element(by.label("button"));

    await assert($element).toExist();
  } catch (err) {
    expect(err).toBeInstanceOf(ElementActionError);
    expect(err).toHaveProperty("message", "Failed to retrieve existence status of element.");
  }
});