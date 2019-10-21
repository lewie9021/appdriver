# `.swipeDown(options: Object) => Element`

Performs a swipe down gesture on the element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): X coordinate to begin the gesture from. Defaults to 0.
  - `options.y` (`Number?`): Y coordinate to begin the gesture from. Defaults to 0.
  - `options.distance` (`Number`): Distance of swipe in density independent pixels (DIP).
  - `options.duration` (`Number?`): Time in milliseconds to perform the swipe gesture.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Swipe down 48 pixels. This will swipe down from the coordinate (100, 0) to (100, 48), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeDown({ x: 100, distance: 48 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeUp(options: Object) => Promise`](./swipeUp.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)