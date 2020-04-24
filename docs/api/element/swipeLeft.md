# `.swipeLeft(options: Object) => Element`

Performs a swipe left gesture on the element.

#### Parameters

1. `options` (`Object?`):
    - `options.x` (`Number?`): X coordinate to begin the gesture from. Defaults to 0.
    - `options.y` (`Number?`): Y coordinate to begin the gesture from. Defaults to either `options.distance` or the derived distance from `options.percentage`.
    - `options.distance` (`Number`): Distance of swipe in density independent pixels (DIP). Required if `percentage` isn't provided.
    - `options.percentage` (`Number?`): Percentage distance (0-1) of swipe relative to the height of the element. Required if `distance` isn't provided. 
    - `options.duration` (`Number?`): Time in milliseconds to perform the swipe gesture.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Swipe left 100 pixels. This will swipe left from the coordinate (100, 24) to (0, 24), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeLeft({ y: 24, distance: 100 });
})();
```

Swipe left 50% of the element width. Given the element width is 200, this will swipe left from the coordinate (200, 0) to (100, 0), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeLeft({ x: 200, percentage: 0.5 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeDown(options: Object) => Promise`](./swipeDown.md)
- [`.swipeUp(options: Object) => Promise`](./swipeUp.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)

#### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)