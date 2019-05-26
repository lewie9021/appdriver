const appiumServer = require("./helpers/appiumServer");

jest.mock("../src/session");
const mockSession = require("./helpers/mockSession");

const { elements, by } = require("../");
const { ElementsNotFoundError } = require("../src/errors");

beforeEach(() => {
  mockSession({
    sessionId: "sessionId",
    platformName: "iOS"
  });
});

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an array of elements", async () => {
  const elementIds = ["element-0", "element-1", "element-2"];
  appiumServer.mockFindElements({elements: elementIds});

  const result = await elements(by.label("list-item-*"));

  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(elementIds.length);
});

it("correctly handles find elements request errors", async () => {
  appiumServer.mockFindElements({status: 3});

  await expect(elements(by.label("list-item-*")))
    .rejects.toThrow(ElementsNotFoundError);
});