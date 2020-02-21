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
    degrees: [ 90, 180 ]
  });
  
  await device.performGesture(rotate90);
})();
```

### Common Gestures

- **Tap**: Briefly touch surface with fingertip.
- **Long Press**: Touch surface for extended period of time.
- **Double Tap**: Rapid touch surface twice with fingertip.
- **Swipe**: Move fingertip over surface without losing contact.
- **Flick**: Quickly brush surface with fingertip.
- **Pinch**: Touch surface with two fingers and bring them closer together.
- **Spread**: Touch surface with two fingers and move them apart.
- **Rotate**: Touch surface with two fingers and move them in a clockwise or counterclockwise direction.

### Gestures API

[```.series(Array<Gesture>) => Gesture```](./gestures/series.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.parallel(Array<Gesture>) => Gesture```](./gestures/parallel.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.moveTo(options?: {x?: Number, y?: Number, duration?: Number, relative?: Boolean, element?: Element}) => Gesture```](./gestures/moveTo.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.press(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/press.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.release() => Gesture```](./gestures/release.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.wait(duration: Number) => Gesture```](./gestures/wait.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.tap(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/tap.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.longPress(options?: {x?: Number, y?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/longPress.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipe(options: {x?: Number, y?: Number, distance: Number, direction: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipe.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeUp(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeUp.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeDown(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeDown.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeLeft(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeLeft.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeRight(options: {x?: Number, y?: Number, distance: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/swipeRight.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.pinch(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/pinch.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.spread(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number, element?: Element}) => Gesture```](./gestures/spread.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.rotate(options: {x?: Number, y?: Number, radius: Number: degrees: [start: Number, end: Number], duration?: Number, step?: Number, element?: Element}) => Gesture```](./gestures/rotate.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here
