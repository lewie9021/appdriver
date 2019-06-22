const appiumServer = require("../helpers/appiumServer");

const { ElementActionError } = require("../../src/errors");

const { element, by } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns a list of elements if a match is found", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const findElementsFromElementMock = appiumServer.mockFindElementsFromElement({elementId: "elementId", elements: ["innerElementId", "innerElementId2"]});

  const result = await element(by.label("form"))
    .findElements(by.label("text-input"));

  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(2);
  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementsFromElementMock)).toHaveLength(1);
});

it("throws an ElementActionError exception if a match isn't found", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const findElementsFromElementMock = appiumServer.mockFindElementsFromElement({status: 7, elementId: "elementId"});

  const result = element(by.label("form"))
    .findElements(by.label("text-input"));

  await expect(result).rejects.toThrowError(ElementActionError);

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementsFromElementMock)).toHaveLength(1);
});

it("throws an ElementActionError if element doesn't exist", async () => {
  const findElementMock = appiumServer.mockFindElement({status: 3, elementId: "elementId"});
  const findElementsFromElementMock = appiumServer.mockFindElementsFromElement({elementId: "elementId", elements: ["innerElementId"]});

  const result = element(by.label("form"))
    .findElements(by.label("text-input"));

  await expect(result).rejects.toThrowError(ElementActionError);

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementsFromElementMock)).toHaveLength(0);
});