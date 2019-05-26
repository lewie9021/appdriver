const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the element's width and height", async () => {
  const width = 200;
  const height = 150;

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSize({elementId: "elementId", width, height});

  const result = await element(by.label("box")).getSize();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual({width, height});
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockElementSize({elementId: "elementId", width: 100, height: 32});

  await expect(element(by.label("box")).getSize())
    .rejects.toThrow(ElementNotFoundError);

  expect(fetch).toHaveBeenCalledTimes(1);
});

it("correctly handles size attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementSize({status: 3, elementId: "elementId"});

  await expect(element(by.label("box")).getSize())
    .rejects.toThrow(new ElementActionError("Failed to get element size."));

  expect(fetch).toHaveBeenCalledTimes(2);
});