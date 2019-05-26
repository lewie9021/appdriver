const appiumServer = require("../helpers/appiumServer");
const fetch = require("node-fetch");

const { device, gestures } = require("../../");

afterEach(() => {
  appiumServer.resetMocks();
});

it("executes the given gesture", async () => {
  appiumServer.mockActions();

  await device.performGesture(gestures.swipeUp({x: 150, y: 200, distance: 100}));

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
            {type: "pointerMove", duration: 0, origin: "viewport", x: 150, y: 200},
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

it("correctly handles W3C actions request errors", async () => {
  appiumServer.mockActions({status: 3});

  await expect(device.performGesture(gestures.swipeUp({x: 150, y: 200, distance: 100})))
    .rejects.toThrow(new Error("Failed to perform gesture."));

  expect(fetch).toHaveBeenCalledTimes(1);
});