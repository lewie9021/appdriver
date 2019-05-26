const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

// jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { element, by } = require("../../");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementLocationFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the element's x and y coordinates", async () => {
  const x = 150;
  const y = 400;

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementLocation({elementId: "elementId", x, y});

  const result = await element(by.label("box")).getLocation();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual({x, y});
});

it("accepts a 'relative' parameter to return the element's x and y coordinates relative to the viewport", async () => {
  const x = 150;
  const y = 100;

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementLocationInView({elementId: "elementId", x, y});

  const result = await element(by.label("box")).getLocation({relative: true});

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual({x, y});
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});

  await expect(element(by.label("box")).getLocation())
    .rejects.toThrow(ElementNotFoundError);

  expect(fetch).toHaveBeenCalledTimes(1);
});

it("correctly handles location attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementLocation({status: 3, elementId: "elementId"});

  await expect(element(by.label("box")).getLocation())
    .rejects.toThrow(new ElementActionError("Failed to get element location."));

  expect(fetch).toHaveBeenCalledTimes(2);
});

it("correctly handles relative location attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementLocationInView({status: 3, elementId: "elementId"});

  await expect(element(by.label("box")).getLocation({relative: true}))
    .rejects.toThrow(new ElementActionError("Failed to get element relative location."));

  expect(fetch).toHaveBeenCalledTimes(2);
});