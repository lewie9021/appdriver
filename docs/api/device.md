# Device

The `device` object provides a way of performing interactions within the application that aren't directly linked with elements.

### Examples

```javascript
(async () => {
  const swipeUp = gestures.create()
    .press({x: 160, y: 200})
    .wait(250)
    .moveTo({y: 100})
    .release();
  
  await device.performGesture(swipeUp);
})();
```

```javascript
(async () => {
  await device.setOrientation("PORTRAIT");
})();
```

```javascript
(async () => {
  await device.restartApp();
})();
```

```javascript
(async () => {
  await device.performTouchId({successful: true});
  await device.performFingerPrint({id: 1});
})();
```

```javascript
(async () => {
  await device.startScreenRecording({
    filePath: path.join(__dirname, "recordings", "test-case-1.mp4"),
    format: "mp4",
    quality: "high",
    size: {
      width: 1280,
      height: 720
    }
  });
  
  // Test code here...
  
  await device.stopScreenRecording(); 
})();
```

### Device API

[```.platformName: String```](./device/platformName.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Returns the platform name of the current session.

[```.platformVersion: String```](./device/platformVersion.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Returns the platform version of the current session.

[```.name: String```](./device/name.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Returns the device name of the current session.

[```.wait(duration: Number) => Promise```](./device/wait.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Explicitly wait `duration` milliseconds.

[```.waitFor(conditionFn: Function<Promise>, options?: Object) => Promise```](./device/waitFor.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Polls `conditionFn` every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.restartApp() => Promise```](./device/restartApp.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.resetApp() => Promise```](./device/resetApp.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.goBack() => Promise```](./device/goBack.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

Taps the hardware back button on Android.

[```.isPortrait() => Promise<Boolean>```](./device/isPortrait.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Returns whether the device is in a portrait or landscape orientation.

[```.setPortrait() => Promise```](./device/setPortrait.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Sets the device orientation to portrait.

[```.getOrientation() => Promise<String>```](./device/getOrientation.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves the current orientation of the device.

[```.setOrientation(orientation: String) => Promise```](./device/setOrientation.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Modify the orientation of the device.

[```.getViewport() => Promise<Object>```](./device/getViewport.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves the width and height of the device viewport.

[```.takeScreenshot(options?: Object) => Promise<Buffer>```](./device/takeScreenshot.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Takes a screenshot (PNG) of the entire screen and saves the result on disk at the given `filePath` location.

[```.startScreenRecording(options?: Object) => Promise```](./device/startScreenRecording.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Starts recording the entire screen.

[```.stopScreenRecording() => Promise<Buffer>```](./device/stopScreenRecording.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Stops a screen recording currently in progress.

[```.isKeyboardVisible() => Promise<Boolean>```](./device/isKeyboardVisible.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.hideKeyboard() => Promise```](./device/hideKeyboard.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipe(options: Object) => Promise```](./device/swipe.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe gesture in the context of the device viewport.

[```.swipeUp(options: Object) => Promise```](./device/swipeUp.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe up gesture in the context of the device viewport.

[```.swipeDown(options: Object) => Promise```](./device/swipeDown.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe down gesture in the context of the device viewport.

[```.swipeLeft(options; Object) => Promise```](./device/swipeLeft.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe left gesture in the context of the device viewport.

[```.swipeRight(options: Object) => Promise```](./device/swipeRight.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

TODO: Description here.

[```.performGesture(gesture: Gesture) => Promise```](./device/performGesture.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.
