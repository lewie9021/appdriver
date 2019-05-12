jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { by } = require("../../src/matchers");
const { element } = require("../../src/element.js");
const { ElementNotFoundError, ElementActionError } = require("../../src/errors");
const { createElementFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");
const mockSession = require("../helpers/mockSession");

afterEach(() => {
  jest.resetAllMocks();
});

const testPlatforms = (testPlatformFunc) => {
  ["iOS", "Android"].forEach((platformName) => {
    describe(platformName, () => {
      beforeAll(() => {
        mockSession({
          platformName
        })
      });

      testPlatformFunc();
    });
  });
};

testPlatforms((platformName) => {
  it("returns the element's text value", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.widget.TextView"); // TODO: Switch based on platformName.
    mockCommand(commands.element.attributes.text, () => "Title Text");

    const result = await element(by.label("product-title")).getText();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
    expect(result).toEqual("Title Text");
  });

  it("correctly propagates errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({status: 7, elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.widget.TextView"); // TODO: Switch based on platformName.
    mockCommand(commands.element.attributes.text, () => "Title Text");

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles text attribute request errors", async () => {
    mockCommand(commands.element.findElement, () => createElementFixture({elementId: "elementId"}));
    mockCommand(commands.element.attributes.type, () => "android.widget.TextView"); // TODO: Switch based on platformName.
    mockCommand(commands.element.attributes.text, () => Promise.reject(new Error("Error!")));

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(new ElementActionError("Failed to get text for element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
  });
});