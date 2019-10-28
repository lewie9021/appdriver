const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("correctly executes swipe up gesture", async () => {
  appiumServer.mockActions();

  await device.swipe({x: 250, y: 200, distance: 100, direction: 0});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 250, y: 200},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -100},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("defaults x and y to 0", async () => {
  appiumServer.mockActions();

  await device.swipe({distance: 100, direction: 135});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 0},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 71, y: 71},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("correctly executes swipe right gesture", async () => {
  appiumServer.mockActions();

  await device.swipe({x: 250, y: 200, distance: 100, direction: 90});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 250, y: 200},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 100, y: 0},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("correctly executes swipe down gesture", async () => {
  appiumServer.mockActions();

  await device.swipe({x: 250, y: 200, distance: 100, direction: 180});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 250, y: 200},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 100},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("correctly executes swipe left gesture", async () => {
  appiumServer.mockActions();

  await device.swipe({x: 250, y: 200, distance: 100, direction: 270});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 250, y: 200},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: -100, y: 0},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("correctly executes gesture with duration parameter", async () => {
  appiumServer.mockActions();

  await device.swipe({x: 500, y: 700, distance: 500, direction: 0, duration: 250});

  expect(fetch).toHaveBeenCalledTimes(1);
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 500, y: 700},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 250, origin: "pointer", x: 0, y: -500},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});