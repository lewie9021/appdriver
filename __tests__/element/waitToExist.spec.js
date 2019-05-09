jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element, Element } = require("../../src/element.js");
const { ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementExistsFixture } = require("../fixtures/fixtures");
const { createElementClickFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, () => elementFixture);
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: true}));

  const $element = await element(by.label("button")).waitToExist();

  expect($element).toBeInstanceOf(Element);
  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.exists).toHaveBeenCalledTimes(1);
  await expect($element.value).resolves.toEqual(elementFixture);
});

it("returns a new element to avoid unwanted mutation", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: true}));

  const $element = await element(by.label("button"));
  const $newElement = await $element.waitToExist();

  expect($newElement).not.toBe($element);
});

it("polls for visibility up to 5 times before throwing", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));

  await expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new Error("Element not found after 5 attempts (interval: 200ms)."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.exists).toHaveBeenCalledTimes(5);
});

it("attempts to find the element before checking visibility if receives an ElementNotFound error", async () => {
  mockCommand(commands.element.findElement, [
    () => createElementFixture({status: 7, elementId: "elementId"}),
    () => createElementFixture({status: 7, elementId: "elementId"}),
    () => createElementFixture({elementId: "elementId"})
  ]);
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));

  await expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new Error("Element not found after 5 attempts (interval: 200ms)."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(3);
  expect(commands.element.attributes.exists).toHaveBeenCalledTimes(3);
});

it("forwards new element.value if findElement request is required to check visibility", async () => {
  const elementFixture = createElementFixture({elementId: "elementId"});
  mockCommand(commands.element.findElement, [
    () => createElementFixture({status: 7, elementId: "elementId"}),
    () => elementFixture
  ]);
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: true}));

  const $element = await element(by.label("button")).waitToExist();

  await expect($element.value).resolves.toEqual(elementFixture);
});

it("correctly propagates errors", async () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: true}));
  mockCommand(commands.element.actions.click, () => createElementClickFixture({status: 3}));

  await expect(element(by.label("button")).tap().waitToExist())
    .rejects.toThrow(ElementActionError);
});

it("correctly handles exists attribute request errors", () => {
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
  mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));

  return expect(element(by.label("button")).waitToExist())
    .rejects.toThrow(new ElementActionError("Element not found after 5 attempts (interval: 200ms)."));

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.attributes.exists).toHaveBeenCalledTimes(1);
});

describe("maxRetries parameter", () => {
  it("customises the number of retries to make before throwing", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));
    const maxRetries = 10;

    await expect(element(by.label("button")).waitToExist({maxRetries}))
      .rejects.toThrow(new ElementActionError(`Element not found after ${maxRetries} attempts (interval: 200ms).`));

    expect(commands.element.attributes.exists).toHaveBeenCalledTimes(maxRetries);
  });

  it("is factored into the number of retries made if the element doesn't exist", async () => {
    mockCommand(commands.element.findElement, [
      () => createElementFixture({status: 7, elementId: "elementId"}),
      () => createElementFixture({status: 7, elementId: "elementId"}),
      () => createElementFixture({elementId: "elementId"})
    ]);
    mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));
    const maxRetries = 8;

    await expect(element(by.label("button")).waitToExist({maxRetries}))
      .rejects.toThrow(new ElementActionError(`Element not found after ${maxRetries} attempts (interval: 200ms).`));

    expect(commands.element.attributes.exists).toHaveBeenCalledTimes(maxRetries - 2);
    expect(commands.element.findElement).toHaveBeenCalledTimes(3);
  }, 10000);
});

// TODO: Needs better coverage that just asserting the error message value.
describe("interval parameter", () => {
  it("customises the time between requests when polling", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));
    const interval = 50;

    await expect(element(by.label("button")).waitToExist({interval}))
      .rejects.toThrow(new ElementActionError(`Element not found after 5 attempts (interval: ${interval}ms).`));
  });

  it("is factored into the request polling if the element doesn't exist", async () => {
    mockCommand(commands.element.findElement, [
      () => createElementFixture({status: 7, elementId: "elementId"}),
      () => createElementFixture({status: 7, elementId: "elementId"}),
      () => createElementFixture({elementId: "elementId"})
    ]);
    mockCommand(commands.element.attributes.exists, () => createElementExistsFixture({exists: false}));

    const interval = 50;
    await expect(element(by.label("button")).waitToExist({interval}))
      .rejects.toThrow(new ElementActionError(`Element not found after 5 attempts (interval: ${interval}ms).`));
  }, 10000);
});