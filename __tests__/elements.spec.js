jest.mock("../src/commands");
jest.mock("../src/session");
const commands = require("../src/commands");

const { by } = require("../src/matchers");
const elements = require("../src/elements");
const { ElementsNotFoundError } = require("../src/errors");
const { createElementsFixture } = require("./fixtures/fixtures");
const mockCommand = require("./helpers/mockCommand");
const mockSession = require("./helpers/mockSession");

beforeEach(() => {
  mockSession({
    platformName: "iOS"
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

it("returns an array of elements", async () => {
  const elementIds = ["element-0", "element-1", "element-2"];
  mockCommand(commands.element.findElements, () => createElementsFixture({elementIds}));

  const result = await elements(by.label("list-item-*"));

  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(elementIds.length);
});

it("correctly handles find elements request errors", async () => {
  mockCommand(commands.element.findElements, () => createElementsFixture({status: 3}));

  await expect(elements(by.label("list-item-*")))
    .rejects.toThrow(ElementsNotFoundError);
});