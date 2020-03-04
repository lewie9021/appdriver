# `.toExist() => Promise`

Asserts the element exists.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

```javascript
(async () => {
  await expect(element(by.label("button"))).toExist();
})();
```

#### Related methods

- [`.toBeVisible() => Promise`](./toBeVisible.md)

### Related Appium Docs

- [Find Element](http://appium.io/docs/en/commands/element/find-element/)
