# Device

The `device` object provides a way to interact within the application that's not directly linked to an element.

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
  await device.setOrientation("portrait");
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
    format: "mp4",
    quality: "high",
    size: {
      width: 1280,
      height: 720
    }
  });
  
  // Test code here...
  
  await device.stopScreenRecording(path.join(__dirname, "recordings", "test-case-1.mp4")); 
})();
```

### Device API

:warning: [```.platform: "iOS" | "Android"```](./device/platform.md)

TODO: Description here.

:warning: [```.platformVersion: String```](./device/platformVersion.md)

TODO: Description here.

:warning: [```.name: String```](./device/name.md)

TODO: Description here.

:warning: [```.isReal: Boolean```](./device/isReal.md)

TODO: Description here.

:white_check_mark: [```.restartApp() => Promise```](./device/restartApp.md)

TODO: Description here.

:white_check_mark: [```.resetApp() => Promise```](./device/resetApp.md)

TODO: Description here.

:warning: [```.goBack() => Promise```](./device/goBack.md)

TODO: Description here.

:white_check_mark: [```.setOrientation(orientation: "LANDSCAPE" | "PORTRAIT") => Promise```](./device/setOrientation.md)

TODO: Description here.

:white_check_mark: [```.getOrientation() => Promise<"LANDSCAPE" | "PORTRAIT">```](./device/getOrientation.md)

TODO: Description here.

:white_check_mark: [```.getViewport() => Promise<{width: Number, height: Number}>```](./device/getViewport.md)

TODO: Description here.

:warning: [```.takeScreenshot(filePath?: String) => Promise<{value: String, width: Number, height: Number}>```](./device/takeScreenshot.md)

TODO: Description here.

:warning: [```.isKeyboardVisible() => Promise<Boolean>```](./device/isKeyboardVisible.md)

TODO: Description here.

:warning: [```.hideKeyboard() => Promise```](./device/hideKeyboard.md)

TODO: Description here.

:warning: [```.getGeoLocation() => Promise```](./device/getGeoLocation.md)

TODO: Description here.

:warning: [```.setGeoLocation(options: {latitude: Number, longitude: Number, altitude?: Number}) => Promise```](./device/setGeoLocation.md)

TODO: Description here.

:warning: [```.getClipboard(options? {contentType?: String}) => Promise<String>```](./device/getClipboard.md)

TODO: Description here.

:warning: [```.setClipboard(options: {value: String, contentType?: String, label?: String}) => Promise```](./device/setClipboard.md)

TODO: Description here.

:warning: [```.toggleAirplaneMode() => Promise```](./device/toggleAirplaneMode.md)

TODO: Description here.

:warning: [```.toggleWifi() => Promise```](./device/toggleWifi.md)

TODO: Description here.

:warning: [```.toggleLocation() => Promise```](./device/toggleLocation.md)

TODO: Description here.

:warning: [```.performTouchId(options: {successful: Boolean}) => Promise```](./device/performTouchId.md)

TODO: Description here.

:warning: [```.performFingerPrint(options: {id?: Number}) => Promise```](./device/performFingerPrint.md)

TODO: Description here.

:warning: [```.startScreenRecording(options?: {format?: String, quality?: String, fps?: Number, bitRate?: Number, size?: {width: Number, height: Number}, maxDuration?: Number, forceRestart?: Boolean}) => Promise```](./device/startScreenRecording.md)

TODO: Description here.

:warning: [```.stopScreenRecording(filePath?: String, options?: {username?: String, password?: String, method?: String}) => Promise```](./device/stopScreenRecording.md)

TODO: Description here.

:warning: [```.sendSms({phoneNumber: String, message: String}) => Promise```](./device/sendSms.md)

TODO: Description here.

:warning: [```.getSettings() => Promise<Object>```](./device/getSettings.md)

TODO: Description here.

:warning: [```.setSettings(settings: Object) => Promise```](./device/setSettings.md)

TODO: Description here.

:warning: [```.readFile(filePath: String) => Promise<String>```](./device/readFile.md)

TODO: Description here.

:warning: [```.writeFile(filePath: String, data: String) => Promise```](./device/writeFile.md)

TODO: Description here.

:hammer: [```.swipeUp({x: Number, y: Number, distance: Number, duration?: Number}) => Promise```](./device/swipeUp.md)

TODO: Description here.

:hammer: [```.swipeDown({x: Number, y: Number, distance: Number, duration?: Number}) => Promise```](./device/swipeDown.md)

TODO: Description here.

:hammer: [```.swipeLeft({x: Number, y: Number, distance: Number, duration?: Number}) => Promise```](./device/swipeLeft.md)

TODO: Description here.

:hammer: [```.swipeRight({x: Number, y: Number, distance: Number, duration?: Number}) => Promise```](./device/swipeRight.md)

TODO: Description here.

:hammer: [```.swipe({x: Number, y: Number, direction: Number, distance: Number, duration?: Number}) => Promise```](./device/swipe.md)

TODO: Description here.

:white_check_mark: [```.performGesture(gesture: Gesture) => Promise```](./device/performGesture.md)

TODO: Description here.
