# `.goBack() => Promise`

Taps the hardware back button on Android.

#### Returns

`Promise`: A promise that resolves when the back button has been pressed.

#### Examples

Go to previous screen or exit app.

```javascript
(async () => {
  await device.goBack();
})();
```

- [Go Back](http://appium.io/docs/en/commands/session/back/)