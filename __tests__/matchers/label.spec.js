jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementsFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");
const mockSession = require("../helpers/mockSession");

beforeEach(() => {
  mockSession();
});

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an object containing a resolve method to execute the query", () => {
  const result = by.label("button");

  expect(result).toHaveProperty("resolve");
});

it("supports fetching a single matching element", async () => {
  const accessibilityLabel = "button";
  mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve();

  expect(commands.element.findElement).toHaveBeenCalledTimes(1);
  expect(commands.element.findElement.mock.calls[0][0]).toMatchSnapshot();
});

it("supports fetching multiple matching elements", async () => {
  const accessibilityLabel = "button";
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds: ["element-0", "element-1"]}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve(true);

  expect(commands.element.findElements).toHaveBeenCalledTimes(1);
  expect(commands.element.findElements.mock.calls[0][0]).toMatchSnapshot();
});

it("supports fetching elements starting with a given accessibility label (iOS)", async () => {
  const accessibilityLabel = "list-item-*";
  mockSession({platformName: "iOS"});
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds: ["element-0", "element-1"]}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve(true);

  expect(commands.element.findElements).toHaveBeenCalledTimes(1);
  expect(commands.element.findElements.mock.calls[0][0]).toMatchSnapshot();
});

it("supports fetching elements starting with a given accessibility label (Android)", async () => {
  const accessibilityLabel = "list-item-*";
  mockSession({platformName: "Android"});
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds: ["element-0", "element-1"]}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve(true);

  expect(commands.element.findElements).toHaveBeenCalledTimes(1);
  expect(commands.element.findElements.mock.calls[0][0]).toMatchSnapshot();
});

it("supports fetching elements containing the a accessibility label (iOS)", async () => {
  const accessibilityLabel = "*-item-*";
  mockSession({platformName: "iOS"});
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds: ["element-0", "element-1"]}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve(true);

  expect(commands.element.findElements).toHaveBeenCalledTimes(1);
  expect(commands.element.findElements.mock.calls[0][0]).toMatchSnapshot();
});

it("supports fetching elements containing the a accessibility label (Android)", async () => {
  const accessibilityLabel = "*-item-*";
  mockSession({platformName: "Android"});
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds: ["element-0", "element-1"]}));

  const matcher = by.label(accessibilityLabel);

  await matcher.resolve(true);

  expect(commands.element.findElements).toHaveBeenCalledTimes(1);
  expect(commands.element.findElements.mock.calls[0][0]).toMatchSnapshot();
});