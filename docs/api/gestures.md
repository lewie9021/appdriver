# Gestures

The `gestures` object provides a way to create gestures within the application to be used with either the `device` or `element` objects using their `.performGesture()` method.

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
  const $box = await element(by.id("box"));
  const $destination = await element(by.id("destination"));
  const dragAndDrop = gestures.create()
    .press()
    .wait(250)
    .moveTo({element: $destination})
    .release();
  
  await $box.performGesture(dragAndDrop);
})();
```

```javascript
  const $button = await element(by.id("button"));
  const tap = gestures.create()
    .press()
    .release();
  
  await $button.performGesture(tap);
```

```javascript
  const $button = await element(by.id("button"));
  const longPress = gestures.create()
    .press()
    .wait(500)
    .release();
  
  await $button.performGesture(longPress);
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
})()
```

### Common Gestures

- **Tap**: Briefly touch surface with fingertip.
- **Double Tap**: Rapid touch surface twice with fingertip.
- **Drag**: Move fingertip over surface without losing contact.
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

:warning: [```.swipeUp() => Gesture```](./gestures/swipeUp.md)

TODO: Description here.

### Gesture API

:warning: [```.press({x?: Number, y?: Number}) => Gesture```](./gesture/press.md)

TODO: Description here.

:warning: [```.wait(milliseconds: Number) => Gesture```](./gesture/wait.md)

TODO: Description here.

:warning: [```.moveTo({x?: Number, y?: Number, element?: Element}) => Gesture```](./gesture/moveTo.md)

TODO: Description here.

:warning: [```.release() => Gesture```](./gesture/release.md)

TODO: Description here.


