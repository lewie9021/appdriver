jest.mock("../src/worker/services/appiumService");

const { appiumService } = require("../src/worker/services/appiumService");
const { ElementsNotFoundError, AppiumError } = require("../src/worker/errors");
const { createFindElementsMock } = require("./appiumServiceMocks");
const { setPlatform } = require("./helpers");
const { elements, by } = require("../main");

beforeEach(() => setPlatform("iOS"));

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns an array of elements", async () => {
  const refs = createFindElementsMock({ elementIds: [ "elementId", "elementId2", "elementId3" ] });

  jest.spyOn(appiumService, "findElements").mockResolvedValue(refs);

  const result = await elements(by.label("list-item"));

  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(refs.length);
});

it("throws an ElementNotFoundError for Appium request errors", async () => {
  const error = new AppiumError("Request error.", 3);

  jest.spyOn(appiumService, "findElements").mockRejectedValue(error);
  expect.assertions(2);

  try {
    await elements(by.label("list-item"));
  } catch (err) {
    expect(err).toBeInstanceOf(ElementsNotFoundError);
    expect(err).toHaveProperty("message", `Failed to find elements by label matching "list-item".`);
  }
});

it("propagates other types of errors", async () => {
  const error = new Error("Something went wrong.");

  jest.spyOn(appiumService, "findElements").mockRejectedValue(error);
  expect.assertions(2);

  try {
    await elements(by.label("list-item"));
  } catch (err) {
    expect(err).toBeInstanceOf(error.constructor);
    expect(err).toHaveProperty("message", error.message);
  }
});