const appiumServer = require("../helpers/appiumServer");

const { ElementActionError } = require("../../src/errors");
const { Element } = require("../../src/element");

const { element, by } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns a new element if a match is found", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const findElementFromElementMock = appiumServer.mockFindElementFromElement({elementId: "elementId", element: "innerElementId"});

  const $textInput = await element(by.label("form"))
    .findElement(by.label("text-input"));

  expect($textInput).toBeInstanceOf(Element);
  await expect($textInput.value).resolves.toEqual("innerElementId");
  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementFromElementMock)).toHaveLength(1);
});

it("throws an ElementNotFoundError exception if a match isn't found", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const findElementFromElementMock = appiumServer.mockFindElementFromElement({status: 7, elementId: "elementId"});

  const result = element(by.label("form"))
    .findElement(by.label("text-input"));

  await expect(result).rejects.toThrowError(ElementActionError);

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementFromElementMock)).toHaveLength(0);
});

it("throws an ElementActionError if element doesn't exist", async () => {
  const findElementMock = appiumServer.mockFindElement({status: 3, elementId: "elementId"});
  const findElementFromElementMock = appiumServer.mockFindElementFromElement({elementId: "elementId", element: "innerElementId"});

  const result = element(by.label("form"))
    .findElement(by.label("text-input"));

  await expect(result).rejects.toThrowError(ElementActionError);

  expect(appiumServer.getCalls(findElementMock)).toHaveLength(1);
  expect(appiumServer.getCalls(findElementFromElementMock)).toHaveLength(0);
});