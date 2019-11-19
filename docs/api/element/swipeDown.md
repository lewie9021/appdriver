# `.swipeDown(options: Object) => Element`

Performs a swipe down gesture on the element.

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

Swipe down 48 pixels. This will swipe down from the coordinate (100, 0) to (100, 48), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeDown({ x: 100, distance: 48 });
})();
```

Swipe down 25% of the element height. Given the element has a height of 40, this will swipe down from the coordinate (0, 0) to (0, 10), relative to the element.

```javascript
(async () => {
  await element(by.label("list-item"))
    .swipeDown({ percentage: 0.25 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeUp(options: Object) => Promise`](./swipeUp.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)

### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)