# `.swipeRight(options: Object) => Element`

Performs a swipe right gesture on the element.

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

Swipe right 100 pixels. This will swipe left from the coordinate (0, 24) to (100, 24), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeLeft({ y: 24, distance: 100 });
})();
```

Swipe right 75% of the element width. Given the element has a width of 120, this will swipe right from the coordinate (0, 0) to (90, 0), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeLeft({ percentage: 1 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeDown(options: Object) => Promise`](./swipeDown.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeUp(options: Object) => Promise`](./swipeUp.md)