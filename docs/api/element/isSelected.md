# `.isSelected() => Promise<Boolean>`

Retrieves selected status of element. Please note that this is based on the accessibility state ([React Native](https://facebook.github.io/react-native/docs/accessibility#accessibilitystates-ios-android), [Android](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo#isSelected%28%29), [iOS](https://developer.apple.com/documentation/uikit/uiaccessibility/uiaccessibilitytraits/1620197-selected)) of the element. While the element may appear selected, this may not be the case to Appium.

#### Returns

`Promise` (`Boolean`): Element selected status.

#### Examples

```javascript
(async () => {
  await element(by.label("tab"))
    .isSelected();
})();
```

#### Known Issues

- iOS wasn't supported until [Appium v1.16.0](https://github.com/appium/appium/releases/tag/v1.16.0). 

#### Related Methods

- [`.isDisabled() => Promise<Boolean>`](./isDisabled.md)
- [`.isFocused() => Promise<Boolean>`](./isFocused.md)

### Related Appium Docs

- [Is Element Selected](http://appium.io/docs/en/commands/element/attributes/selected/)