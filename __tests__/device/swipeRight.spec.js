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

  await device.swipeRight({x: 250, y: 200, distance: 100});

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
      {type: "pointerMove", duration: 50, origin: "pointer", x: 100, y: 0},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("correctly executes gesture with percentage value", async () => {
  mockCommand(commands.session.getWindowRect, () => createSessionWindowRectFixture({width: 1000, height: 1600}));
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeRight({x: 850, y: 200, percentage: 0.75});

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 850, y: 200},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 750, y: 0},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("correctly executes gesture with duration parameter", async () => {
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.swipeRight({x: 850, y: 200, distance: 500, duration: 250});

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 850, y: 200},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 250, origin: "pointer", x: 500, y: 0},
      {type: "pointerUp", button: 0}
    ]
  }]);
});