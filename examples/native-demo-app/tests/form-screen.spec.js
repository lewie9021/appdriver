const { by, element, device, commands } = require("../../../index");
const capabilities = require("../config/capabilities");

(async () => {
  console.log("[1] Initialising session...");
  const session = await commands.session.create(capabilities.pixel2);

  console.log("[2] Selecting element...");
  const testId = "form-screen";
  await element(by.label(testId))
    .waitToExist(by.label(testId));

  console.log("[3] Long press...");
  await element(by.label("button"))
    .longPress();


  // const $slider = await element(by.label("slider-input"));
  // const size = await $slider.getSize();
  // const location = await $slider.getLocation({relative: true});
  //
  // console.log("[3] Swiping slider...");
  // await device.performGesture([{
  //   "type": "pointer",
  //   "id": "finger1",
  //   "parameters": {"pointerType": "touch"},
  //   "actions": [
  //     {"type": "pointerMove", "duration": 0, "origin": "viewport", "x": location.x, "y": location.y},
  //     {"type": "pointerDown", "button": 0},
  //     {"type": "pause", "duration": 250},
  //     {"type": "pointerMove", "duration": 100, "origin": "pointer", "x": size.width / 2, "y": 0},
  //     {"type": "pointerUp", "button": 0}
  //   ]
  // }]);

  // console.log("[3] Inputting Text...");
  // const $element = await element(by.label("text-input"))
  //   .tap()
  //   .typeText("Hello World!");
  //
  // await delay(3000);
  //
  // console.log("[4] Clearing Text...");
  // $element
  //   .clearText();



  // const viewport = await device.getViewport();
  // console.log("[3] viewport dimensions", viewport);

  // const swipeLeft = gestures.swipeLeft({
  //   x: viewport.width * 0.75,
  //   y: viewport.height / 2,
  //   distance: viewport.width * 0.75,
  // });
  //
  // await device.performGesture([swipeLeft]);
  // await device.performGesture([swipeLeft]);

  // await device.restartApp(capabilities.iPhoneX);
  // await device.resetApp(capabilities.iPhoneX);

  // const dimensions = await element(by.id("box"))
  //   .waitToExist(by.id("box"))
  //   .getSize();
  //
  // console.log("[3] box dimensions", dimensions);
})();