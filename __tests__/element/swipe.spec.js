const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const actionsMock = appiumServer.mockActions();

  const $element = await element(by.label("list-item")).swipe({ distance: 100, direction: 0 });

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect($element).toBeInstanceOf(Element);
  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);
  await expect($element.value).resolves.toEqual("elementId");
});

it("defaults x and y to 0", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const actionsMock = appiumServer.mockActions();

  await element(by.label("list-item")).swipe({distance: 100, direction: 135});

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
        {type: "pointerMove", duration: 50, origin: "pointer", x: 71, y: 71},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it("correctly executes swipe up gesture", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const actionsMock = appiumServer.mockActions();

  await element(by.label("list-item")).swipe({ x: 100, y: 48, distance: 48, direction: 0 });

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
        {type: "pointerMove", duration: 0, origin: { element: "elementId" }, x: 100, y: 48},
        {type: "pointerDown", button: 0},
        {type: "pause", duration: 250},
        {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -48},
        {type: "pointerUp", button: 0}
      ]
    }]
  });
});

it.todo("correctly executes swipe right gesture");
it.todo("correctly executes swipe down gesture");
it.todo("correctly executes swipe left gesture");
it.todo("correctly executes gesture with duration parameter");

it("correctly propagates errors", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const clickElementMock = appiumServer.mockClickElement({status: 7, elementId: "elementId"});
  const actionsMock = appiumServer.mockActions();

  const result = element(by.label("list-item"))
    .tap()
    .swipe({ x: 100, y: 48, distance: 48, direction: 0 });

  await expect(result)
    .rejects.toThrow(ElementActionError);

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const clickElementMockCalls = appiumServer.getCalls(clickElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(clickElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(0);
});

it("throws action error if element doesn't exist", async () => {
  const findElementMock = appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  const actionsMock = appiumServer.mockActions();

  const result = element(by.label("list-item"))
    .swipe({ x: 100, y: 48, distance: 48, direction: 0 });

  await expect(result)
    .rejects.toThrow(ElementActionError);

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(0);
});

it("correctly handles W3C action request errors", async () => {
  const findElementMock = appiumServer.mockFindElement({elementId: "elementId"});
  const actionsMock = appiumServer.mockActions({status: 3});

  await expect(element(by.label("list-item")).swipe({ x: 100, y: 48, distance: 48, direction: 0 }))
    .rejects.toThrow(new ElementActionError("Failed to swipe on element."));

  const findElementMockCalls = appiumServer.getCalls(findElementMock);
  const actionMockCalls = appiumServer.getCalls(actionsMock);

  expect(findElementMockCalls).toHaveLength(1);
  expect(actionMockCalls).toHaveLength(1);
});