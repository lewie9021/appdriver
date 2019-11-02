# Gesture

The `gesture` instance has several methods to define a gesture and can be used in combination with `gestures.series` and `gestures.parallel` to create complex gestures such as pinch and rotate. `gesture` instances can be used with either the `device` or `element` objects via their `.performGesture()` method. To create a `gesture` instance, you must use `gestures.create()`.

### Examples

Swipe Gesture:

```javascript
(async () => {
  const $scrollView = await element(by.label("scroll-view"));
  const size = await $scrollView.getSize();
  const swipeUp = gestures.create()
    .press({
      x: size.width / 2,
      y: size.height / 2
    })
    .wait({duration: 250})
    .moveTo({y: (size.height / 2) - 100})
    .release();
  
  await device.performGesture(swipeUp);
})();
```

Drop 'n' Drag Gesture:

```javascript
(async () => {
  const $box = await element(by.label("box"));
  const $destination = await element(by.label("destination"));
  const dragAndDrop = gestures.create()
    .press({element: $box})
    .wait({duration: 250})
    .moveTo({element: $destination})
    .release();
  
  await device.performGesture(dragAndDrop);
})();
```

Tap Gesture:

```javascript
(async () => {
  const $button = await element(by.label("button"));
  const tap = gestures.create()
    .press()
    .release();
  
  await $button.performGesture(tap);
})();
```

Double Tap Gesture:

```javascript
(async () => {
  const $button = await element(by.label("button"));
  const tap = gestures.create()
    .press()
    .release();
  const doubleTap = gestures.series([
    tap,
    gestures.wait({duration: 50}),
    tap
  ]);
  
  await $button.performGesture(doubleTap);
})();
```

Press Gesture:

```javascript
(async () => {
  const $button = await element(by.label("button"));
  const longPress = gestures.create()
    .press()
    .wait({duration: 500})
    .release();
  
  await $button.performGesture(longPress);
})();
```

Pinch Gesture:

```javascript
(async () => {
  const $scrollView = await element(by.label("scroll-view"));
  const size = await $scrollView.getSize();
  
  const swipeLeft = gestures.create()
    .press({
      x: size.width / 2,
      y: size.height / 2
    })
    .moveTo({x: size.width / 4})
    .release();
  const swipeRight = gestures.create()
    .press({
      x: size.width - (size.width / 4),
      y: size.height / 2
    })
    .moveTo({x: size.width / 2})
    .release();
  const pinch = gestures.parallel([swipeLeft, swipeRight]);
  
  await $scrollView.performGesture(pinch);
})();
```

### Gesture API

[```.press(options?: {x?: Number, y?: Number, relative?: Boolean, element?: Element}) => Gesture```](./gesture/press.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

TODO: Description here.

[```.wait(options: {duration: Number}) => Gesture```](./gesture/wait.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

TODO: Description here.

[```.moveTo(options: {x: Number, y: Number, relative?: Boolean, duration?: Number, element?: Element}) => Gesture```](./gesture/moveTo.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

TODO: Description here.

[```.release() => Gesture```](./gesture/release.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

TODO: Description here.
