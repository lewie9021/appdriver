const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { device } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("correctly executes gesture with distance value", async () => {
  appiumServer.mockActions();

  await device.swipeUp({x: 250, y: 200, distance: 100});

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

it("correctly executes gesture with percentage value", async () => {
  appiumServer.mockWindowRect({width: 1000, height: 1600});
  appiumServer.mockActions();

  await device.swipeUp({x: 500, y: 1500, percentage: 0.75});

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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 500, y: 1500},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -1200},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("correctly executes gesture with duration parameter", async () => {
  appiumServer.mockActions();

  await device.swipeUp({x: 500, y: 700, distance: 500, duration: 250});

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

it("defaults y value to distance or derived percentage", async () => {
  appiumServer.mockWindowRect({width: 1000, height: 1600});
  appiumServer.mockActions();

  await device.swipeUp({x: 200, distance: 500});
  await device.swipeUp({x: 200, percentage: 0.75});

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenNthCalledWith(
    1,
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 200, y: 500},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -500},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
  expect(fetch).toHaveBeenNthCalledWith(
    3,
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 200, y: 1200},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -1200},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});

it("defaults x value to 0", async () => {
  appiumServer.mockWindowRect({width: 1000, height: 1600});
  appiumServer.mockActions();

  await device.swipeUp({y: 350, distance: 150});
  await device.swipeUp({y: 500, percentage: 0.2});

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenNthCalledWith(
    1,
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 350},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -150},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
  expect(fetch).toHaveBeenNthCalledWith(
    3,
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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 500},
            {type: "pointerDown", button: 0},
            {type: "pause", duration: 250},
            {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -320},
            {type: "pointerUp", button: 0}
          ]
        }]
      })
    })
  );
});