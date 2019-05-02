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

:white_check_mark: [```.setOrientation(orientation: "LANDSCAPE" | "PORTRAIT") => Promise```](./device/setOrientation.md)

TODO: Description here.

:white_check_mark: [```.getOrientation() => "LANDSCAPE" | "PORTRAIT"```](./device/getOrientation.md)

TODO: Description here.

:warning: [```.takeScreenshot(options?: {filePath?: String}) => {value: String, width: Number, height: Number}```](./device/takeScreenshot.md)

TODO: Description here.

:warning: [```.getGeoLocation() => Promise```](./device/getGeoLocation.md)

TODO: Description here.

:warning: [```.setGeoLocation(options: {latitude: Number, longitude: Number, altitude?: Number}) => Promise```](./device/setGeoLocation.md)

TODO: Description here.

:warning: [```.toggleAirplaneMode() => Promise```](./device/toggleAirplaneMode.md)

TODO: Description here.

:warning: [```.toggleWifi() => Promise```](./device/toggleWifi.md)

TODO: Description here.

:warning: [```.toggleLocation() => Promise```](./device/toggleLocation.md)

TODO: Description here.

:warning: [```.sendSms({phoneNumber: String, message: String}) => Promise```](./device/sendSms.md)

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