const appiumServer = require("../helpers/appiumServer");

const { element, by } = require("../../");
const { Element } = require("../../src/Element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();

  const $element = await element(by.label("list-item")).swipeLeft({ distance: 100 });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect($element).toBeInstanceOf(Element);
  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);
  await expect($element.value).resolves.toEqual("elementId");
});

it("correctly executes swipe left gesture", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();

  await element(by.label("list-item")).swipeLeft({ x: 100, y: 24, distance: 100 });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);
  expect(actionMockCalls[0].options.body).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: { element: "elementId" }, x: 100, y: 24},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: -100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("correctly executes gesture with percentage value", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const elementSizeMock = appiumServer.mockElementSize({ elementId: "elementId", width: 200, height: 48 });
  const actionsMock = appiumServer.mockActions();

  await element(by.label("list-item")).swipeLeft({ percentage: 0.25 });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const elementSizeMockCalls = appiumServer.getCalls(elementSizeMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(2);
  expect(elementSizeMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);

  expect(actionMockCalls[0].payload).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: { element: "elementId" }, x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: -50, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("defaults x and y to 0", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();

  await element(by.label("list-item")).swipeLeft({ distance: 100 });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);

  expect(actionMockCalls[0].options.body).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: {element: "elementId"}, x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: -100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("correctly executes gesture with duration parameter", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();
  const duration = 500;

  await element(by.label("list-item")).swipeLeft({ distance: 100, duration });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);

  expect(actionMockCalls[0].options.body).toEqual({
    actions: [{
      id: "finger1",
      type: "pointer",
      parameters: {
        pointerType: "touch"
      },
      actions: [
        {type: "pointerMove", duration: 0, origin: {element: "elementId"}, x: 0, y: 0},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration, origin: "pointer", x: -100, y: 0},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("correctly propagates errors", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const clearElementMock = appiumServer.mockClearElement({ status: 7, elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();

  const result = element(by.label("list-item"))
    .clearText()
    .swipeLeft({ x: 100, y: 24, distance: 100 });

  await expect(result)
    .rejects.toThrow(ElementActionError);

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const clearElementMockCalls = appiumServer.getCalls(clearElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(clearElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(0);
});

it("throws action error if element doesn't exist", async () => {
  const findElementMock = appiumServer.mockFindElement({ status: 7, elementId: "elementId" });
  const actionsMock = appiumServer.mockActions();

  const result = element(by.label("list-item"))
    .swipeLeft({ x: 100, y: 24, distance: 100 });

  await expect(result)
    .rejects.toThrow(ElementActionError);

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(0);
});

it("correctly handles W3C action request errors", async () => {
  const findElementMock = appiumServer.mockFindElement({ elementId: "elementId" });
  const actionsMock = appiumServer.mockActions({ status: 3 });

  await expect(element(by.label("list-item")).swipeLeft({ x: 100, y: 24, distance: 100 }))
    .rejects.toThrow(new ElementActionError("Failed to swipe left on element."));

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);
});