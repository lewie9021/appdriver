# Gestures

The `gestures` object provides a way to create gestures within the application to be used with either the `device` or `element` objects using their `.performGesture()` method.

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

:warning: [```.create() => Gesture```](./gestures/create.md)

TODO: Description here.

:warning: [```.parallel(Array<Gesture>) => Gesture```](./gestures/parallel.md)

TODO: Description here.

:warning: [```.series(Array<Gesture>) => Gesture```](./gestures/series.md)

TODO: Description here.

:warning: [```.tap({x: Number, y: Number, duration: Number}) => Gesture```](./gestures/tap.md)

TODO: Description here.

:warning: [```.doubleTap({x: Number, y: Number, duration: Number}) => Gesture```](./gestures/doubleTap.md)

TODO: Description here.

:warning: [```.longPress({x: Number, y: Number, duration: Number}) => Gesture```](./gestures/doubleTap.md)

TODO: Description here.

:warning: [```.swipeUp({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeUp.md)

TODO: Description here.

:warning: [```.swipeDown({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeDown.md)

TODO: Description here.

:warning: [```.swipeLeft({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeLeft.md)

TODO: Description here.

:warning: [```.swipeRight({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeRight.md)

TODO: Description here.

:warning: [```.pinch({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/pinch.md)

TODO: Description here.

:warning: [```.spread({x: Number, y: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/spread.md)

TODO: Description here.

:warning: [```.rotate({x: Number, y: Number, radius: Number: degrees: [start: Number, end: Number], duration?: Number, step?: Number}) => Gesture```](./gestures/rotate.md)

TODO: Description here