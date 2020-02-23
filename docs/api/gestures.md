# Gestures

The `gestures` object provides a toolbox of presets and utility functions for composing a range of custom gestures to be executed via `device.performGesture()`.

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

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.parallel(Array<Gesture>) => Gesture```](./gestures/parallel.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.moveTo(options?: {x?: Number, y?: Number, duration?: Number, relative?: Boolean}) => Gesture```](./gestures/moveTo.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.press(options?: {x?: Number, y?: Number, duration?: Number}) => Gesture```](./gestures/press.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.release() => Gesture```](./gestures/release.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.wait(duration: Number) => Gesture```](./gestures/wait.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.tap(options?: {x?: Number, y?: Number, duration?: Number}) => Gesture```](./gestures/tap.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.doubleTap(options?: {x?: Number, y?: Number, duration?: Number}) => Gesture```](./gestures/doubleTap.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.longPress(options?: {x?: Number, y?: Number, duration?: Number}) => Gesture```](./gestures/longPress.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipe(options: {x?: Number, y?: Number, distance: Number, direction: Number, duration?: Number}) => Gesture```](./gestures/swipe.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeUp(options: {x?: Number, y?: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeUp.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeDown(options: {x?: Number, y?: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeDown.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeLeft(options: {x?: Number, y?: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeLeft.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipeRight(options: {x?: Number, y?: Number, distance: Number, duration?: Number}) => Gesture```](./gestures/swipeRight.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.pinch(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number}) => Gesture```](./gestures/pinch.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.spread(options: {x?: Number, y?: Number, distance: Number, angle?: Number, duration?: Number}) => Gesture```](./gestures/spread.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.rotate(options: {x?: Number, y?: Number, radius: Number: degrees: [start: Number, end: Number], duration?: Number, step?: Number}) => Gesture```](./gestures/rotate.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here

[```.dragAndDrop(options: {x1: Number, y1: Number, x2: Number, y2: Number, duration?: Number}) => Gesture```](./gestures/dragAndDrop.md)

<img src="https://img.shields.io/badge/Platform-Native-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here
