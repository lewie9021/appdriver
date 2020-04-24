# `.toBeSelected() => Promise`

Asserts the element is selected.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

```javascript
(async () => {
  await expect(element(by.label("tab"))).toBeSelected();
})();
```

#### Related methods

- [`.toBeDisabled() => Promise`](./toBeDisabled.md)
- [`.toBeFocused() => Promise`](./toBeFocused.md)

#### Related Appium Docs

- [Is Element Selected](http://appium.io/docs/en/commands/element/attributes/selected/)
