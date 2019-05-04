const commands = require("../src/commands");
const { by } = require("../src/matchers");
const { delay } = require("../src/utils");
const { element, Element } = require("../src/element.js");
const elementFixture = require("./fixtures/element.json");
const { ElementNotFoundError, ElementActionError } = require("../src/errors");
const { createElementFixture } = require("./fixtures/fixtures");
const { createElementTextFixture } = require("./fixtures/fixtures");
const { createElementClickFixture } = require("./fixtures/fixtures");

beforeEach(() => {
  jest.spyOn(commands.element, "findElement")
    .mockImplementationOnce(() => {
      return delay(1000)
        .then(() => elementFixture);
    });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Find Element", () => {
  it("returns a selector", () => {
    const selector = element(by.label("list-item"));

    expect(selector).toBeInstanceOf(Element);
    expect(commands.element.findElement).not.toBeCalled();
  });

  it("returns an 'Element' that is 'thenable'", async () => {
    const selector = element(by.label("list-item"));

    expect(selector).toBeInstanceOf(Element);
    expect(typeof selector.then).toBe("function");
  });

  it("executes the matcher when awaited", async () => {
    const selector = element(by.label("list-item"));
    const $element = await selector;

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toBeCalledTimes(1);
  });

  it("allows chaining methods", async () => {
    jest.spyOn(commands.element.actions, "click")
      .mockImplementation(() => {
        return delay(1000)
          .then(() => createElementClickFixture());
      });

    const $element = await element(by.label("list-item")).tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });
});

describe("getText", () => {
  beforeEach(() => {
    jest.spyOn(commands.element.attributes, "text")
      .mockImplementation(() => {
        return delay(1000)
          .then(() => createElementTextFixture({text: "Title Text"}));
      });
  });

  it("returns the element's text value", async () => {
    const result = await element(by.label("product-title")).getText();

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
    expect(result).toEqual("Title Text");
  });

  it("correctly propagates errors", async () => {
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementationOnce(() => {
        return delay(1000)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      });

    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles text attribute request errors", async () => {
    commands.element.attributes.text.mockReset();
    jest.spyOn(commands.element.attributes, "text")
      .mockImplementation(() => {
        return delay(1000)
          .then(() => createElementTextFixture({status: 3, text: null}));
      });
    await expect(element(by.label("product-title")).getText())
      .rejects.toThrow(new ElementActionError("Failed to get text for element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.text).toHaveBeenCalledTimes(1);
  });
});

describe("tap", () => {
  beforeEach(() => {
    jest.spyOn(commands.element.actions, "click")
      .mockImplementation(() => {
        return delay(1000)
          .then(() => createElementClickFixture());
      });
  });

  it("returns an instance of Element to enable function chaining", async () => {
    const $element = await element(by.label("product-title")).tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });

  it("returns a new element to avoid unwanted mutation", async () => {
    const $element = await element(by.label("list-item"));
    const $newElement = await $element.tap();

    // expect($newElement).toStrictEqual($element);

    expect($newElement).not.toBe($element);
  });

  it("correctly propagates errors", async () => {
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementationOnce(() => {
        return delay(1000)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      });

    await expect(element(by.label("list-item")).tap())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles text attribute request errors", async () => {
    commands.element.actions.click.mockReset();
    jest.spyOn(commands.element.actions, "click")
      .mockImplementation(() => {
        return delay(1000)
          .then(() => createElementClickFixture({status: 3}));
      });
    return expect(element(by.label("list-item")).tap())
      .rejects.toThrow(new ElementActionError("Failed to tap element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });
});