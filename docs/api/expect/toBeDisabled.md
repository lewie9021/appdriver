# `.toBeDisabled() => Promise`

Asserts the element is disabled.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

```javascript
(async () => {
  await expect(element(by.label("button"))).toBeDisabled();
})();
```

#### Related methods

- [`.toBeSelected() => Promise`](./toBeSelected.md)
- [`.toBeFocused() => Promise`](./toBeFocused.md)

#### Related Appium Docs

- [Is Element Enabled](http://appium.io/docs/en/commands/element/attributes/enabled/)
