const commands = require("../src/commands");
const { by } = require("../src/matchers");
const { delay } = require("../src/utils");
const { element, Element } = require("../src/element.js");
const elementFixture = require("./fixtures/element.json");
const { ElementNotFoundError, ElementActionError } = require("../src/errors");
const { createElementFixture } = require("./fixtures/fixtures");
const { createElementTextFixture } = require("./fixtures/fixtures");
const { createElementClickFixture } = require("./fixtures/fixtures");
const { createElementValueFixture } = require("./fixtures/fixtures");
const { createElementClearFixture } = require("./fixtures/fixtures");
const { createElementDisplayedFixture } = require("./fixtures/fixtures");

beforeEach(() => {
  jest.spyOn(commands.element, "findElement")
    .mockImplementation(() => {
      return delay(200)
        .then(() => elementFixture);
    });

  global.session = {
    platformName: "iOS"
  };
});

afterEach(() => {
  jest.resetAllMocks();
  global.session = null;
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
        return delay(200)
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
        return delay(200)
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
      .mockImplementation(() => {
        return delay(200)
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
        return delay(200)
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
        return delay(200)
          .then(() => createElementClickFixture());
      });
  });

  it("returns an instance of Element to enable function chaining", async () => {
    const $element = await element(by.label("product-title")).tap();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
    await expect($element.value).resolves.toEqual(elementFixture);
  });

  it("returns a new element to avoid unwanted mutation", async () => {
    const $element = await element(by.label("list-item"));
    const $newElement = await $element.tap();

    expect($newElement).not.toBe($element);
  });

  it("correctly propagates errors", async () => {
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      });

    await expect(element(by.label("list-item")).tap())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles click action request errors", async () => {
    commands.element.actions.click.mockReset();
    jest.spyOn(commands.element.actions, "click")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementClickFixture({status: 3}));
      });
    return expect(element(by.label("list-item")).tap())
      .rejects.toThrow(new ElementActionError("Failed to tap element."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });
});

describe("typeText", () => {
  beforeEach(() => {
    jest.spyOn(commands.element.actions, "sendKeys")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementValueFixture());
      });
  });

  it("returns an instance of Element to enable function chaining", async () => {
    const $element = await element(by.label("text-input")).typeText("Hello World!");

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.sendKeys).toHaveBeenCalledTimes(1);
    await expect($element.value).resolves.toEqual(elementFixture);
  });

  it("throws if no text isn't a string", async () => {
    await expect(element(by.label("text-input")).typeText())
      .rejects.toThrow(new Error("Failed to type text. 'text' must be a string, instead got undefined."));

    await expect(element(by.label("text-input")).typeText(1000))
      .rejects.toThrow(new Error("Failed to type text. 'text' must be a string, instead got number."));
  });

  it("returns a new element to avoid unwanted mutation", async () => {
    const $element = await element(by.label("text-input"));
    const $newElement = await $element.typeText("Hello World!");

    expect($newElement).not.toBe($element);
  });

  it("correctly propagates errors", async () => {
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      });

    await expect(element(by.label("text-input")).typeText("Hello World!"))
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.sendKeys).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles send key request errors", async () => {
    commands.element.actions.sendKeys.mockReset();
    jest.spyOn(commands.element.actions, "sendKeys")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementValueFixture({status: 3}));
      });
    return expect(element(by.label("text-input")).typeText("Hello World!"))
      .rejects.toThrow(new ElementActionError("Failed to type text."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });

  it("correctly handles case when hardware keyboard is attached on iOS simulator", async () => {
    commands.element.actions.sendKeys.mockReset();
    jest.spyOn(commands.element.actions, "sendKeys")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementValueFixture({status: 13}));
      });
    return expect(element(by.label("text-input")).typeText("Hello World!"))
      .rejects.toThrow(new ElementActionError("Failed to type text. Make sure hardware keyboard is disconnected from iOS simulator."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.click).toHaveBeenCalledTimes(1);
  });
});

describe("clearText", () => {
  beforeEach(() => {
    jest.spyOn(commands.element.actions, "clear")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementClearFixture());
      });
  });

  it("returns an instance of Element to enable function chaining", async () => {
    const $element = await element(by.label("text-input")).clearText();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.clear).toHaveBeenCalledTimes(1);
    await expect($element.value).resolves.toEqual(elementFixture);
  });

  it("returns a new element to avoid unwanted mutation", async () => {
    const $element = await element(by.label("text-input"));
    const $newElement = await $element.clearText();

    expect($newElement).not.toBe($element);
  });

  it("correctly propagates errors", async () => {
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      });

    await expect(element(by.label("text-input")).clearText())
      .rejects.toThrow(ElementNotFoundError);

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.clear).not.toHaveBeenCalledTimes(1);
  });

  it("correctly handles clear action request errors", async () => {
    commands.element.actions.clear.mockReset();
    jest.spyOn(commands.element.actions, "clear")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementClearFixture({status: 3}));
      });
    return expect(element(by.label("text-input")).clearText())
      .rejects.toThrow(new ElementActionError("Failed to clear text."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.actions.clear).toHaveBeenCalledTimes(1);
  });
});

describe("waitToBeVisible", () => {
  beforeEach(() => {
    jest.spyOn(commands.element.attributes, "displayed")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementDisplayedFixture({displayed: true}));
      });
  });

  it("returns an instance of Element to enable function chaining", async () => {
    const $element = await element(by.label("button")).waitToBeVisible();

    expect($element).toBeInstanceOf(Element);
    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(1);
    await expect($element.value).resolves.toEqual(elementFixture);
  });

  it("returns a new element to avoid unwanted mutation", async () => {
    const $element = await element(by.label("button"));
    const $newElement = await $element.waitToBeVisible();

    expect($newElement).not.toBe($element);
  });

  it("polls for visibility up to 5 times before throwing", async () => {
    commands.element.attributes.displayed.mockReset();
    jest.spyOn(commands.element.attributes, "displayed")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementDisplayedFixture({displayed: false}));
      });

    await expect(element(by.label("button")).waitToBeVisible())
      .rejects.toThrow(new Error("Element not visible after 5 attempts (interval: 200ms)."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(5);
  });

  it("attempts to find the element before checking visibility if receives an ElementNotFound error", async () => {
    commands.element.attributes.displayed.mockReset();
    jest.spyOn(commands.element.attributes, "displayed")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementDisplayedFixture({displayed: false}));
      });
    commands.element.findElement.mockReset();
    jest.spyOn(commands.element, "findElement")
      .mockImplementationOnce(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      })
      .mockImplementationOnce(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      })
      .mockImplementationOnce(() => {
        return delay(200)
          .then(() => createElementFixture({elementId: "elementId"}));
      });

    await expect(element(by.label("button")).waitToBeVisible())
      .rejects.toThrow(new Error("Element not visible after 5 attempts (interval: 200ms)."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(3);
    expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(3);
  });

  it("forwards new element.value if findElement request is required to check visibility", async () => {
    const elementFixture = createElementFixture({elementId: "elementId"});

    jest.spyOn(commands.element, "findElement")
      .mockImplementationOnce(() => {
        return delay(200)
          .then(() => createElementFixture({status: 7, elementId: "elementId"}));
      })
      .mockImplementationOnce(() => {
        return delay(200)
          .then(() => elementFixture);
      });

    const $element = await element(by.label("button")).waitToBeVisible();

    await expect($element.value).resolves.toEqual(elementFixture);
  });

  it("correctly propagates errors", async () => {
    await expect(element(by.label("button")).tap().waitToBeVisible())
      .rejects.toThrow(ElementActionError);
  });

  it("correctly handles displayed attribute request errors", () => {
    commands.element.attributes.displayed.mockReset();
    jest.spyOn(commands.element.attributes, "displayed")
      .mockImplementation(() => {
        return delay(200)
          .then(() => createElementDisplayedFixture({displayed: false}));
      });

    return expect(element(by.label("button")).waitToBeVisible())
      .rejects.toThrow(new ElementActionError("Element not visible after 5 attempts (interval: 200ms)."));

    expect(commands.element.findElement).toHaveBeenCalledTimes(1);
    expect(commands.element.attributes.displayed).toHaveBeenCalledTimes(1);
  });
});