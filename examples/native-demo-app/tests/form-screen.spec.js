const { by, element, device, commands, gestures } = require("../../../index");
const capabilities = require("../config/capabilities");

(async () => {
  console.log("[1] Initialising session...");
  const session = await commands.session.create(capabilities.iPhoneX);

  console.log("[2] Selecting element...");
  const testId = "form-screen";
  await element(by.label(testId)).waitToExist(by.label(testId));

  console.log("[3] Inputting Text...");
  const $element = await element(by.label("text-input"))
    .tap()
    .typeText("Hello World!");

  console.log("[4] Clearing Text...");
  $element.clearText();

  const $slider = await element(by.label("slider-input"));
  const size = await $slider.getSize();
  const location = await $slider.getLocation({relative: true});

  console.log("[5] Swiping slider...");
  await device.performGesture(
    gestures.swipeRight({
      x: location.x,
      y: location.y,
      distance: size.width / 2
    })
  );

  console.log("[6] Long press...");
  await element(by.label("button")).longPress();

  // await device.restartApp(capabilities.iPhoneX);
  // await device.resetApp(capabilities.iPhoneX);

  // const dimensions = await element(by.id("box"))
  //   .waitToExist(by.id("box"))
  //   .getSize();
  //
  // console.log("[3] box dimensions", dimensions);
})();