# `.swipe(options: Object) => Promise`

Performs a swipe gesture in the context of the device viewport.

#### Parameters

1. `options` (`Object`):
  - `options.x` (`Number?`): X coordinate to begin the gesture from. Defaults to 0.
  - `options.y` (`Number?`): Y coordinate to begin the gesture from. Defaults to 0.
  - `options.distance` (`Number`): Distance of swipe in density independent pixels (DIP).
  - `options.direction` (`Number`): Direction in degrees (0-359) of swipe.
  - `options.duration` (`Number?`): Time in milliseconds to perform the swipe gesture.

#### Returns

`Promise`: A promise that resolves after the gesture is complete.

#### Examples

Swipe left 100 pixels. This will swipe left from the coordinate (200, 200) to (100, 200), relative to the device viewport.

```javascript
(async () => {
  await device.swipe({ x: 200, y: 200, distance: 100, direction: 270 });
})();
```

#### Related methods

- [`.swipeUp(options: Object) => Promise`](./swipeUp.md)
- [`.swipeDown(options: Object) => Promise`](./swipeDown.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)

### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)