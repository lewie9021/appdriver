# `.isDisabled() => Promise<Boolean>`

Retrieves disabled status of element. Please note that this is based on the accessibility state ([React Native](https://facebook.github.io/react-native/docs/accessibility#accessibilitystates-ios-android), [Android](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.html#isEnabled%28%29), [iOS](https://developer.apple.com/documentation/uikit/uiaccessibility/uiaccessibilitytraits/1620208-notenabled)) of the element. While the element may appear disabled, this may not be the case to Appium.

#### Returns

`Promise` (`Boolean`): Element disabled status.

#### Examples

Disabled status of text input:

```javascript
(async () => {
  const disabled = await element(by.label("text-input"))
    .isDisabled();
})();
```

#### Related Methods

- [`.isSelected() => Promise<Boolean>`](./isSelected.md)
- [`.isFocused() => Promise<Boolean>`](./isFocused.md)

#### Related Appium Docs

- [Is Element Enabled](http://appium.io/docs/en/commands/element/attributes/enabled/)