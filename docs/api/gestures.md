# Gestures

The `gestures` object provides a toolbox of presets and utility functions for composing a range of custom gestures. All gestures must be executed in one of the following contexts:
- Device: `device.performGesture()`
- Element: `element.performGesture()`

### Examples

Rotate Gesture:

```javascript
(async () => {
  const viewport = await device.getViewportSize();
  const rotate90 = gestures.rotate({
    x: viewport.width / 2,
    y: viewport.height / 2,
    radius: 25,
    degrees: [90, 180]
  });
  
  await device.performGesture(rotate90);
})();
```

### Common Gestures

- **Tap**: Briefly touch surface with fingertip.
- **Double Tap**: Rapid touch surface twice with fingertip.
- **Swipe**: Move fingertip over surface without losing contact.
- **Flick**: Quickly brush surface with fingertip.
- **Pinch**: Touch surface with two fingers and bring them closer together.
- **Spread**: Touch surface with two fingers and move them apart.
- **Press**: Touch surface for extended period of time.
- **Rotate**: Touch surface with two fingers and move them in a clockwise or counterclockwise direction.

### Gestures API

:white_check_mark: [```.create() => Gesture```](./gestures/create.md)

TODO: Description here.

:hammer: [```.parallel(Array<Gesture>) => Gesture```](./gestures/parallel.md)

TODO: Description here.

:hammer: [```.series(Array<Gesture>) => Gesture```](./gestures/series.md)

TODO: Description here.

:hammer: [```.tap(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/tap.md)

TODO: Description here.

:hammer: [```.doubleTap(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/doubleTap.md)

TODO: Description here.

:white_check_mark: :hammer: [```.longPress(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/longPress.md)

TODO: Description here.

:hammer: [```.swipeUp(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeUp.md)

TODO: Description here.

:hammer: [```.swipeDown(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeDown.md)

TODO: Description here.

:white_check_mark: :hammer: [```.swipeLeft(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeLeft.md)

TODO: Description here.

:white_check_mark: :hammer: [```.swipeRight(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeRight.md)

TODO: Description here.

:hammer: [```.pinch(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/pinch.md)

TODO: Description here.

:hammer: [```.spread(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/spread.md)

TODO: Description here.

:hammer: [```.rotate(options: {x?: Number, y?: Number, radius: Number: degrees: [start: Number, end: Number], duration?: Number, step?: Number, element?: Element}) => Gesture```](./gestures/rotate.md)

TODO: Description here
