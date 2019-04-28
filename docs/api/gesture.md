# Gestures

The `gesture` instance has several methods to define a gesture and can be used in combination with `gestures.series` and `gestures.parallel` to create complex gestures such as pinch and rotate. `gesture` instances can be used with either the `device` or `element` objects via their `.performGesture()` method. To create a `gesture` instance, you must use `gestures.create()`.

### Examples

Swipe Gesture:

```javascript
(async () => {
  const $scrollView = await element(by.id("scroll-view"));
  const size = await $scrollView.getSize();
  const swipeUp = gestures.create()
    .press({
      x: size.width / 2,
      y: size.height / 2
    })
    .wait(250)
    .moveTo({y: (size.height / 2) - 100})
    .release();
  
  await device.performGesture(swipeUp);
})();
```

Drop 'n' Drag Gesture:

```javascript
(async () => {
  const $box = await element(by.id("box"));
  const $destination = await element(by.id("destination"));
  const dragAndDrop = gestures.create()
    .press({element: $box})
    .wait(250)
    .moveTo({element: $destination})
    .release();
  
  await device.performGesture(dragAndDrop);
})();
```

Tap Gesture:

```javascript
(async () => {
  const $button = await element(by.id("button"));
  const tap = gestures.create()
    .press()
    .release();
  
  await $button.performGesture(tap);
})();
```

Double Tap Gesture:

```javascript
(async () => {
  const $button = await element(by.id("button"));
  const tap = gestures.create()
    .press()
    .release();
  const doubleTap = gestures.series([tap, gestures.wait(50), tap]);
  
  await $button.performGesture(doubleTap);
})();
```

Press Gesture:

```javascript
(async () => {
  const $button = await element(by.id("button"));
  const longPress = gestures.create()
    .press()
    .wait(500)
    .release();
  
  await $button.performGesture(longPress);
})();
```

Pinch Gesture:

```javascript
(async () => {
  const $scrollView = await element(by.id("scroll-view"));
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

:warning: [```.press({x?: Number, y?: Number}) => Gesture```](./gesture/press.md)

TODO: Description here.

:warning: [```.wait(milliseconds: Number) => Gesture```](./gesture/wait.md)

TODO: Description here.

:warning: [```.moveTo({x?: Number, y?: Number, element?: Element}) => Gesture```](./gesture/moveTo.md)

TODO: Description here.

:warning: [```.release() => Gesture```](./gesture/release.md)

TODO: Description here.