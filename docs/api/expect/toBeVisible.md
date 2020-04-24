# `.toBeVisible() => Promise`

Asserts the element is visible.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

```javascript
(async () => {
  await expect(element(by.label("image"))).toBeVisible();
})();
```

#### Related methods

- [`.toExist() => Promise`](./toExist.md)

#### Related Appium Docs

- [Is Element Displayed](http://appium.io/docs/en/commands/element/attributes/displayed/)
