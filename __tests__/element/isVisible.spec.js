const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns the element's displayed value", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const result = await element(by.label("button")).isVisible();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual(true);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockElementDisplayed({elementId: "elementId", displayed: true});

  const result = element(by.label("button"))
    .tap()
    .isVisible();

  await expect(result)
    .rejects.toThrow(ElementActionError);

  expect(fetch).toHaveBeenCalledTimes(1);
});

it("correctly handles displayed attribute request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockElementDisplayed({status: 3, elementId: "elementId"});

  await expect(element(by.label("product-title")).isVisible())
    .rejects.toThrow(new ElementActionError("Failed to retrieve visibility status of element."));

  expect(fetch).toHaveBeenCalledTimes(2);
});