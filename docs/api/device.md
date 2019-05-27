# Device

The `device` object provides a way of performing interactions within the application that aren't directly linked with elements.

### Examples

```javascript
(async () => {
  const swipeUp = gestures.create()
    .press({x: 160, y: 200})
    .wait({duration: 250})
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

[```.platform: "iOS" | "Android"```](./device/platform.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.platformVersion: String```](./device/platformVersion.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.name: String```](./device/name.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

:warning: [```.isReal: Boolean```](./device/isReal.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.wait(duration: Number) => Promise```](./device/wait.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.restartApp() => Promise```](./device/restartApp.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.resetApp() => Promise```](./device/resetApp.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.goBack() => Promise```](./device/goBack.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.setOrientation(orientation: "LANDSCAPE" | "PORTRAIT") => Promise```](./device/setOrientation.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.getOrientation() => Promise<"LANDSCAPE" | "PORTRAIT">```](./device/getOrientation.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.getViewport() => Promise<Object>```](./device/getViewport.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

:warning: [```.takeScreenshot(options?: {filePath?: String}) => Promise```](./device/takeScreenshot.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.startScreenRecording(options?: {filePath?: String, remote? {username?: String, password?: String, method?: String}, format?: String, quality?: String, fps?: Number, bitRate?: Number, size?: {width: Number, height: Number}, maxDuration?: Number, forceRestart?: Boolean}) => Promise```](./device/startScreenRecording.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.stopScreenRecording() => Promise```](./device/stopScreenRecording.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.isKeyboardVisible() => Promise<Boolean>```](./device/isKeyboardVisible.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.hideKeyboard() => Promise```](./device/hideKeyboard.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.getGeoLocation() => Promise```](./device/getGeoLocation.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.setGeoLocation(options: {latitude: Number, longitude: Number, altitude?: Number}) => Promise```](./device/setGeoLocation.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.getClipboard(options? {contentType?: String}) => Promise<String>```](./device/getClipboard.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.setClipboard(value: String, options?: {contentType?: String, label?: String}) => Promise```](./device/setClipboard.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.toggleAirplaneMode() => Promise```](./device/toggleAirplaneMode.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.toggleWifi() => Promise```](./device/toggleWifi.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.toggleLocation() => Promise```](./device/toggleLocation.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.performTouchId(options: {successful: Boolean}) => Promise```](./device/performTouchId.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.performFingerPrint(options: {id?: Number}) => Promise```](./device/performFingerPrint.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.sendSms({phoneNumber: String, message: String}) => Promise```](./device/sendSms.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.getSettings() => Promise<Object>```](./device/getSettings.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.setSettings(settings: Object) => Promise```](./device/setSettings.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.readFile(filePath: String) => Promise<String>```](./device/readFile.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

:warning: [```.writeFile(filePath: String, data: String) => Promise```](./device/writeFile.md)

<img src="https://img.shields.io/badge/Dev-Draft-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.swipeUp(options: {x?: Number, y?: Number, distance?: Number, percentage?: Number, duration?: Number}) => Promise```](./device/swipeUp.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.swipeDown(options: {x?: Number, y?: Number, distance?: Number, percentage?: Number, duration?: Number}) => Promise```](./device/swipeDown.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.swipeLeft(options; {x?: Number, y?: Number, distance?: Number, percentage?: Number, duration?: Number}) => Promise```](./device/swipeLeft.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.swipeRight(options: {x?: Number, y?: Number, distance?: Number, percentage?: Number, duration?: Number}) => Promise```](./device/swipeRight.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.

[```.swipe(options: {x?: Number, y?: Number, direction: Number, distance: Number, duration?: Number}) => Promise```](./device/swipe.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.performGesture(gesture: Gesture) => Promise```](./device/performGesture.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

TODO: Description here.
