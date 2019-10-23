# `.swipeUp(options: Object) => Element`

Performs a swipe up gesture on the element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): X coordinate to begin the gesture from. Defaults to 0.
  - `options.y` (`Number?`): Y coordinate to begin the gesture from. Defaults to 0.
  - `options.distance` (`Number`): Distance of swipe in density independent pixels (DIP). Required if `percentage` isn't provided.
  - `options.percentage` (`Number?`): Percentage distance (0-1) of swipe relative to the height of the element. Required if `distance` isn't provided. 
  - `options.duration` (`Number?`): Time in milliseconds to perform the swipe gesture.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Swipe up 48 pixels. This will swipe up from the coordinate (100, 48) to (100, 0), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeUp({ x: 100, y: 48, distance: 48 });
})();
```

Swipe up 50% of the element height. Given the element has a height of 200, this will swipe up from the coordinate (0, 100) to (0, 0), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeUp({ y: 100, percentage: 0.5 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeDown(options: Object) => Promise`](./swipeDown.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)