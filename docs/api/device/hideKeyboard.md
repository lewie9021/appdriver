# `.hideKeyboard() => Promise`

Hides the on-screen keyboard.

#### Returns

`Promise`: A promise that resolves once keyboard is no longer visible.

#### Examples

```javascript
(async () => {
  await device.hideKeyboard();
  await device.isKeyboardVisible(); // false
})();
```

#### Related Methods

- [`.isKeyboardVisible() => Promise<Boolean>`](./isKeyboardVisible.md)

#### Related Docs

- [Hide Keyboard (Appium)](http://appium.io/docs/en/commands/device/keys/hide-keyboard/)