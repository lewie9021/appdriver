const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the element's disabled status", async () => {
  const disabled = true;

  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementEnabled({elementId: "elementId", enabled: !disabled});

  const result = await element(by.label("text-input")).isDisabled();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual(disabled);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockElementEnabled({elementId: "elementId", enabled: true});

  await expect(element(by.label("text-input")).isDisabled())
    .rejects.toThrow(ElementNotFoundError);

  expect(fetch).toHaveBeenCalledTimes(1);
});

it("correctly handles enabled attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementEnabled({status: 3, elementId: "elementId"});

  await expect(element(by.label("text-input")).isDisabled())
    .rejects.toThrow(new ElementActionError("Failed to retrieve disabled status of element."));

  expect(fetch).toHaveBeenCalledTimes(2);
});