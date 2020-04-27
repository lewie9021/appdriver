# `.toBeVisible() => Promise`

Asserts visibility status of elements and alerts.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Element:

```javascript
(async () => {
  await expect(element(by.label("image"))).toBeVisible();
})();
```

Alert:

```javascript
(async () => {
  await expect(alert).toBeVisible();
})();
```

#### Related methods

- [`.toExist() => Promise`](./toExist.md)

#### Related Docs

- [Is Element Displayed](http://appium.io/docs/en/commands/element/attributes/displayed/)
- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)
