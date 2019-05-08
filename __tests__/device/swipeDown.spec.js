jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { device } = require("../../index.js");
const { createSessionWindowRectFixture } = require("../fixtures/fixtures");
const { createFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("correctly executes gesture with distance value", async () => {
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeDown({x: 250, y: 200, distance: 100});

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
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
  }]);
});

it("correctly executes gesture with percentage value", async () => {
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({width: 1000, height: 1600}));
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeDown({x: 500, y: 1500, percentage: 0.75});

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 500, y: 1500},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 1200},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("correctly executes gesture with duration parameter", async () => {
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeDown({x: 500, y: 700, distance: 500, duration: 250});

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 500, y: 700},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 250, origin: "pointer", x: 0, y: 500},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("defaults y value to 0", async () => {
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({width: 1000, height: 1600}));
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeDown({x: 200, distance: 500});
  await device.swipeDown({x: 200, percentage: 0.75});

  expect(commands.interactions.actions).toHaveBeenNthCalledWith(1, [{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 200, y: 0},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 500},
      {type: "pointerUp", button: 0}
    ]
  }]);
  expect(commands.interactions.actions).toHaveBeenNthCalledWith(2, [{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 200, y: 0},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 1200},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("defaults x value to 0", async () => {
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({width: 1000, height: 1600}));
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeDown({y: 350, distance: 150});
  await device.swipeDown({y: 500, percentage: 0.2});

  expect(commands.interactions.actions).toHaveBeenNthCalledWith(1, [{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 350},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 150},
      {type: "pointerUp", button: 0}
    ]
  }]);
  expect(commands.interactions.actions).toHaveBeenNthCalledWith(2, [{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 0, y: 500},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: 320},
      {type: "pointerUp", button: 0}
    ]
  }]);
});