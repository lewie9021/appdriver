jest.mock("../src/stores/configStore");
jest.mock("../src/worker/services/appiumService");

const { appiumService } = require("../src/worker/services/appiumService");
const { createFindElementMock } = require("./appiumServiceMocks");
const { setPlatform, setConfig } = require("./helpers");
const { Element } = require("../src/worker/Element");
const { element, by } = require("../main");

beforeEach(() => {
  setPlatform("iOS");
  setConfig({ findInterval: 200, findTimeout: 1000 });
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

it("returns an Element instance", () => {
  const result = element(by.label("list-item"));

  expect(result).toBeInstanceOf(Element);
});

it("returns an Element instance that is 'thenable'", async () => {
  const result = element(by.label("list-item"));

  expect(result).toBeInstanceOf(Element);
  expect(result.then).toBeInstanceOf(Function);
});

it("supports method chaining", async () => {
  const ref = createFindElementMock();

  jest.spyOn(appiumService, "findElement").mockResolvedValue(ref);
  jest.spyOn(appiumService, "tapElement").mockResolvedValue(null);

  const result = await element(by.label("list-item")).tap();

  expect(result).toBeInstanceOf(Element);
  expect(appiumService.findElement).toHaveBeenCalledTimes(1);
  expect(appiumService.tapElement).toHaveBeenCalledTimes(1);
});