jest.mock("../../src/session");
const mockSession = require("../helpers/mockSession");

jest.mock("node-fetch");
const mockRequests = require("../helpers/mockRequests");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementClickFixture } = require("../fixtures/fixtures");

const BASE_URL = "http://localhost:4723/wd/hub";

beforeAll(() => {
  mockSession({
    platformName: "iOS",
    sessionId: "sessionId"
  });
});

afterEach(() => {
  mockRequests.reset();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});

  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: elementFixture
  });
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/click`,
    response: createElementClickFixture()
  });

  const $element = await element(by.label("product-title")).tap();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: createElementFixture({elementId: "elementId"})
  });
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/click`,
    response: createElementClickFixture()
  });

  const $element = await element(by.label("list-item"));
  const $newElement = await $element.tap();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: createElementFixture({status: 7})
  });
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/click`,
    response: createElementClickFixture()
  });

  await expect(element(by.label("list-item")).tap())
    .rejects.toThrow(ElementNotFoundError);
});

it("correctly handles click action request errors", async () => {
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element`,
    response: createElementFixture({elementId: "elementId"})
  });
  mockRequests.post({
    url: `${BASE_URL}/session/sessionId/element/elementId/click`,
    response: createElementClickFixture({status: 3})
  });

  return expect(element(by.label("list-item")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));
});