# `.isKeyboardVisible() => Promise<Boolean>`

Returns whether the keyboard is visible or not.

#### Returns

`Promise` (`Boolean`): Whether the keyboard is visible or not.

#### Examples

```javascript
(async () => {
  const visible = await device.isKeyboardVisible();
  console.log(visible); // true
})();
```

#### Related Methods

- [`.hideKeyboard() => Promise`](./hideKeyboard.md)

#### Related Docs

- [Is Keyboard Shown (Appium)](http://appium.io/docs/en/commands/device/keys/is-keyboard-shown/)