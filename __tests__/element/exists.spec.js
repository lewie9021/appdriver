const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns false if element doesn't exist and existence call fails", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockElementType({status: 3, elementId: "elementId"});

  const result = await element(by.label("button")).exists();

  expect(result).toEqual(false);

  expect(fetch).toHaveBeenCalledTimes(2);
});


it("returns true if the element exists and existence call succeeds", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const result = await element(by.label("button")).exists();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual(true);
});

it("returns false if element exists but existence call fails", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementType({status: 3, elementId: "elementId"});

  const result = await element(by.label("button")).exists();

  expect(result).toEqual(false);

  expect(fetch).toHaveBeenCalledTimes(2);
});

it("returns true if element doesn't exist but existence call succeeds", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockFindElement({elementId: "elementId"});

  const result = await element(by.label("button")).exists();

  expect(result).toEqual(true);

  expect(fetch).toHaveBeenCalledTimes(2);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockClickElement({status: 3, elementId: "elementId"});
  appiumServer.mockElementType({elementId: "elementId", type: "XCUIElementTypeOther"});

  const result = element(by.label("button"))
    .tap()
    .exists();

  await expect(result)
    .rejects.toThrow(ElementActionError);

  expect(fetch).toHaveBeenCalledTimes(2);
});