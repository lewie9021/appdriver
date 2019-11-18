jest.mock("../src/services/appiumService");

const { appiumService } = require("../src/services/appiumService");
const { createFindElementMock } = require("./appiumServiceMocks");
const { Element } = require("../src/Element");
const { element, by } = require("../");

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