jest.mock("../../src/commands");
const commands = require("../../src/commands");

const { device, gestures } = require("../../index.js");
const { createFixture } = require("../fixtures/fixtures");
const mockCommand = require("../helpers/mockCommand");

afterEach(() => {
  jest.resetAllMocks();
});

it("executes the given gesture", async () => {
  mockCommand(commands.interactions.actions, () => createFixture());

  await device.performGesture(gestures.swipeUp({x: 150, y: 200, distance: 100}));

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
  expect(commands.interactions.actions).toHaveBeenCalledWith([{
    id: "finger1",
    type: "pointer",
    parameters: {
      pointerType: "touch"
    },
    actions: [
      {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
      {type: "pointerDown", button: 0},
      {type: "pause", duration: 250},
      {type: "pointerMove", duration: 50, origin: "pointer", x: 0, y: -100},
      {type: "pointerUp", button: 0}
    ]
  }]);
});

it("correctly handles W3C actions request errors", async () => {
  mockCommand(commands.interactions.actions, () => createFixture({status: 3}));

  await expect(device.performGesture(gestures.swipeUp({x: 150, y: 200, distance: 100})))
    .rejects.toThrow(new Error("Failed to perform gesture."));

  expect(commands.interactions.actions).toHaveBeenCalledTimes(1);
});