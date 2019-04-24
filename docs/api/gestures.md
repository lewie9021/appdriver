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

### Gestures API

:warning: [```.create() => Gesture```](./gestures/create.md)

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


