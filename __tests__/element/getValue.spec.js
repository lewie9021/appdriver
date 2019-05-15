jest.mock("../../src/commands");
jest.mock("../../src/session");
const commands = require("../../src/commands");
const session = require("../../src/session");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const { createElementValueFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

const testPlatform = (platformName) => {
  const inputElementType = platformName === "iOS"
    ? "XCUIElementTypeTextField"
    : "android.widget.EditText";

  it("returns the element's value", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => inputElementType);
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "Hello World!"}));

    const result = await element(by.label("text-input")).getValue();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
    expect(result).toEqual("Hello World!");
  });

  it("correctly propagates errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => inputElementType);
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "Hello World!"}));

    await expect(element(by.label("text-input")).getValue())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles value attribute request errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => inputElementType);
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({status: 3}));

    await expect(element(by.label("text-input")).getValue())
      .rejects.toThrow(new ElementActionError("Failed to get value for element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
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

  it("correctly handles native switch element value (ON)", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "XCUIElementTypeSwitch");
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "1"}));

    const result = await element(by.label("switch")).getValue();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
    expect(result).toEqual(true);
  });

  it("correctly handles native switch element value (OFF)", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "XCUIElementTypeSwitch");
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "0"}));

    const result = await element(by.label("switch")).getValue();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });
});

describe("Android", () => {
  beforeEach(() => {
    session.getSession.mockReturnValue({
      platformName: "Android"
    });
  });

  testPlatform("Android");

  it("correctly handles native switch element value (ON)", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.widget.Switch");
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "ON"}));

    const result = await element(by.label("switch")).getValue();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
    expect(result).toEqual(true);
  });

  it("correctly handles native switch element value (OFF)", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.widget.Switch");
    mockCommand(commands.element.attributes.value, () => createElementValueFixture({value: "OFF"}));

    const result = await element(by.label("switch")).getValue();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.value).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });
});