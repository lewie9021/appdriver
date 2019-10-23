const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { element, by } = require("../../");
const { Element } = require("../../src/element");
const { ElementActionError } = require("../../src/errors");

afterEach(() => {
  appiumServer.resetMocks();
});

it("returns an instance of Element to enable function chaining", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions();

  const $element = await element(by.label("button")).longPress();

  expect($element).toBeInstanceOf(Element);
  await expect($element.value).resolves.toEqual("elementId");
});

it("executes a long press gesture", async () => {
  const elementId = "elementId";

  appiumServer.mockFindElement({elementId});
  appiumServer.mockActions();

  await element(by.label("button")).longPress();

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        actions: [{
          id: "finger1",
          type: "pointer",
          parameters: {
            pointerType: "touch"
          },
          actions: [
            {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y: 0},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 750},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("accepts an x parameter to offset from the left of the element", async () => {
  const elementId = "elementId";
  const x = 100;

  appiumServer.mockFindElement({elementId});
  appiumServer.mockActions();

  await element(by.label("button")).longPress({x});

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        actions: [{
          id: "finger1",
          type: "pointer",
          parameters: {
            pointerType: "touch"
          },
          actions: [
            {type: "pointerMove", duration: 0, origin: {element: elementId}, x, y: 0},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 750},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("accepts an y parameter to offset from the top of the element", async () => {
  const elementId = "elementId";
  const y = 32;

  appiumServer.mockFindElement({elementId});
  appiumServer.mockActions();

  await element(by.label("button")).longPress({y});

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        actions: [{
          id: "finger1",
          type: "pointer",
          parameters: {
            pointerType: "touch"
          },
          actions: [
            {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 750},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("accepts a duration parameter to redefine how long to perform the press action", async () => {
  const elementId = "elementId";
  const duration = 1000;

  appiumServer.mockFindElement({elementId});
  appiumServer.mockActions();

  await element(by.label("button")).longPress({duration});

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        actions: [{
          id: "finger1",
          type: "pointer",
          parameters: {
            pointerType: "touch"
          },
          actions: [
            {type: "pointerMove", duration: 0, origin: {element: elementId}, x: 0, y: 0},
            {type: "pointerDown", button: 0},
            {type: "pause", duration},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("returns a new element to avoid unwanted mutation", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions();

  const $element = await element(by.label("button"));
  const $newElement = await $element.longPress();

  expect($newElement).not.toBe($element);
});

it("correctly propagates errors", async () => {
  appiumServer.mockFindElement({ elementId: "elementId" });
  appiumServer.mockClearElement({ status: 7, elementId: "elementId" });
  appiumServer.mockActions();

  const result = element(by.label("button"))
    .clearText()
    .longPress();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("throws action error if element doesn't exist", async () => {
  appiumServer.mockFindElement({status: 7, elementId: "elementId"});
  appiumServer.mockActions();

  const result = element(by.label("button"))
    .longPress();

  await expect(result)
    .rejects.toThrow(ElementActionError);
});

it("correctly handles W3C action request errors", async () => {
  appiumServer.mockFindElement({elementId: "elementId"});
  appiumServer.mockActions({status: 3});

  await expect(element(by.label("button")).longPress())
    .rejects.toThrow(new ElementActionError("Failed to long press element."));

  expect(fetch).toHaveBeenCalledTimes(2);
});