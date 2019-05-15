jest.mock("../../src/commands");
jest.mock("../../src/session");
const commands = require("../../src/commands");
const session = require("../../src/session");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

const testPlatform = (platformName) => {
  const textElementType = platformName === "iOS"
    ? "XCUIElementTypeStaticText"
    : "android.widget.TextView";

  it("returns the element's text value", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => textElementType);
    mockCommand(commands.element.attributes.text, () => "Title Text");

    const result = await element(by.label("product-title")).getText();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
    expect(result).toEqual("Title Text");
  });

  it("correctly propagates errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => textElementType);
    mockCommand(commands.element.attributes.text, () => "Title Text");

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles text attribute request errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => textElementType);
    mockCommand(commands.element.attributes.text, () => Promise.reject(new Error("Error!")));

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(new ElementActionError("Failed to get text for element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
  });
};

afterEach(() => {
  jest.resetAllMocks();
});

describe("iOS", () => {
  beforeEach(() => {
    session.getSession.mockReturnValue({
      platformName: "iOS"
    });
  });

  testPlatform("iOS");

  it("returns inner text if element isn't directly text", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "XCUIElementTypeOther");
    mockCommand(commands.element.findElementsFromElement, () => [
      {"element-6066-11e4-a52e-4f735466cecf": "elementId1", ELEMENT: "elementId1"},
      {"element-6066-11e4-a52e-4f735466cecf": "elementId2", ELEMENT: "elementId2"}
    ]);
    mockCommand(commands.element.attributes.text, [
      () => "",
      () => "Hello",
      () => "World!"
    ]);

    const result = await element(by.label("product-title")).getText();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.findElementsFromElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(3);
    expect(result).toEqual("Hello World!");
  });
});

describe("Android", () => {
  beforeEach(() => {
    session.getSession.mockReturnValue({
      platformName: "Android"
    });
  });

  testPlatform("Android");

  it("returns inner text if element isn't directly text", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.view.ViewGroup");
    mockCommand(commands.element.findElementsFromElement, () => [
      {"element-6066-11e4-a52e-4f735466cecf": "elementId1", ELEMENT: "elementId1"},
      {"element-6066-11e4-a52e-4f735466cecf": "elementId2", ELEMENT: "elementId2"}
    ]);
    mockCommand(commands.element.attributes.text, [
      () => "Hello",
      () => "World!"
    ]);

    const result = await element(by.label("product-title")).getText();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.findElementsFromElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(2);
    expect(result).toEqual("Hello World!");
  });
});