# `.goBack() => Promise`

Go to the previous screen. On Android, this will be the hardware back button.

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