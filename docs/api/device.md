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

:white_check_mark: [```.restartApp() => Device```](./device/restartApp.md)

TODO: Description here.

:warning: [```.swipeUp({distance?: Number, duration?: Number, startX?: Number, startY?: Number}) => Device```](./device/swipeUp.md)

TODO: Description here.

:warning: [```.swipeDown({distance?: Number, duration?: Number, startX?: Number, startY?: Number}) => Device```](./device/swipeDown.md)

TODO: Description here.

:warning: [```.swipeLeft({distance?: Number, duration?: Number, startX?: Number, startY?: Number}) => Device```](./device/swipeLeft.md)

TODO: Description here.

:warning: [```.swipeRight({distance?: Number, duration?: Number, startX?: Number, startY?: Number}) => Device```](./device/swipeRight.md)

TODO: Description here.

:warning: [```.swipe({duration?: Number, startX: Number, startY: Number, endX: Number, endY: Number}) => Device```](./device/swipe.md)

TODO: Description here.

:white_check_mark: [```.setOrientation(orientation: "landscape" | "portrait") => Device```](./device/setOrientation.md)

TODO: Description here.

:white_check_mark: [```.getOrientation() => Device```](./device/getOrientation.md)

TODO: Description here.