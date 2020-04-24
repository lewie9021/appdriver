# `.toBeFocused() => Promise`

Asserts the element is focused.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

```javascript
(async () => {
  await expect(element(by.label("text-input"))).toBeFocused();
})();
```

#### Related methods

- [`.toBeDisabled() => Promise`](./toBeDisabled.md)
- [`.toBeSelected() => Promise`](./toBeSelected.md)

#### Related Appium Docs

- [Get Active Element (iOS)](http://appium.io/docs/en/commands/element/other/active/)
- [Get Element Attribute (Android)](http://appium.io/docs/en/commands/element/attributes/attribute/)
