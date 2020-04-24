# `.isFocused() => Promise<Boolean>`

Retrieves focused status of element.

#### Returns

`Promise` (`Boolean`): Element focused status.

#### Examples

Text input:

```javascript
(async () => {
  await element(by.label("text-input"))
    .isFocused();
})();
```

#### Related Methods

- [`.isDisabled() => Promise<Boolean>`](./isDisabled.md)
- [`.isSelected() => Promise<Boolean>`](./isSelected.md)

#### Related Appium Docs

- [Get Active Element (iOS)](http://appium.io/docs/en/commands/element/other/active/)
- [Get Element Attribute (Android)](http://appium.io/docs/en/commands/element/attributes/attribute/)
