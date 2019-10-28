const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions();

  const $element = await element(by.label("button")).tap();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual("elementId");
});

it("executes a tap gesture", async () => {
  const elementId = "elementId";

  const findElementMock = appiumServer.mockFindElement({elementId});
  const tapElementMock = appiumServer.mockActions();

  await element(by.label("button")).tap();

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const tapElementMockCalls = appiumServer.getCalls(tapElementMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(tapElementMockCalls).toHaveLength(1);
  expect(tapElementMockCalls[0].options.body).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 100},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("accepts x and y parameters to offset from the top left of the element", async () => {
  const elementId = "elementId";
  const x = 100;
  const y = 24;

  const findElementMock = appiumServer.mockFindElement({elementId});
  const tapElementMock = appiumServer.mockActions();

  await element(by.label("button")).tap({ x, y });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const tapElementMockCalls = appiumServer.getCalls(tapElementMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(tapElementMockCalls).toHaveLength(1);
  expect(tapElementMockCalls[0].options.body).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: {element: elementId}, x, y},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 100},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions();

  const $element = await element(by.label("button"));
  const $newElement = await $element.tap();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({ elementId: "elementId" });
  appiumServer.mockClearElement({ status: 3, elementId: "elementId" });
  appiumServer.mockActions();

  const result = element(by.label("button"))
    .clearText()
    .tap();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("throws action error if element doesn't exist", async () => {
  appiumServer.mockFindElement({ status: 7, elementId: "elementId" });
  appiumServer.mockActions();

  const result = element(by.label("button")).tap();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("correctly handles W3C action request errors", async () => {
  appiumServer.mockFindElement({ elementId: "elementId" });
  appiumServer.mockActions({ status: 3 });

  return expect(element(by.label("button")).tap())
    .rejects.toThrow(new ElementActionError("Failed to tap element."));
});