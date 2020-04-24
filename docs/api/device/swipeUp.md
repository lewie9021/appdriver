# `.swipeUp(options: Object) => Promise`

Performs a swipe up gesture in the context of the device viewport.

#### Parameters

1. `options` (`Object`):
    - `options.x` (`Number?`): X coordinate to begin the gesture from. Defaults to 0.
    - `options.y` (`Number?`): Y coordinate to begin the gesture from. Defaults to either `distance` or the derived distance from `percentage`.
    - `options.distance` (`Number?`): Distance of swipe in density independent pixels (DIP). Required if `percentage` isn't provided.
    - `options.percentage` (`Number?`): Percentage distance (0-1) of swipe relative to the height of the device viewport. Required if `distance` isn't provided. 
    - `options.duration` (`Number?`): Time in milliseconds to perform the swipe gesture.

#### Returns

`Promise`: A promise that resolves after the gesture is complete.

#### Examples

Swipe up 50% of the screen. Given a viewport height of 800, this will swipe up from the coordinate (0, 500) to (0, 100), relative to the device viewport.

```javascript
(async () => {
  await device.swipeUp({ y: 500, percentage: 0.5 });
})();
```

Swipe up 200 pixels. This will swipe up from the coordinate (100, 500) to (100, 300), relative to the device viewport.

```javascript
(async () => {
  await device.swipeUp({ x: 100, y: 500, distance: 200 });
})();
```

Swipe up 100 pixels. This will swipe up from the coordinate (0, 100) to (0, 0), relative to the device viewport.

```javascript
(async () => {
  await device.swipeUp({ distance: 100 });
})();
```

#### Related methods

- [`.swipe(options: Object) => Promise`](./swipe.md)
- [`.swipeDown(options: Object) => Promise`](./swipeDown.md)
- [`.swipeLeft(options: Object) => Promise`](./swipeLeft.md)
- [`.swipeRight(options: Object) => Promise`](./swipeRight.md)

#### Related Docs

- [W3C Actions (Appium)](http://appium.io/docs/en/commands/interactions/actions/)
- [Actions (W3C)](https://www.w3.org/TR/webdriver/#actions)