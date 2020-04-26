# `.isVisible() => Promise<Boolean>`

Returns whether an alert is visible.

#### Returns

`Promise` (`Boolean`): Whether the alert is visible or not.

#### Examples

```javascript
(async () => {
  const visible = await alert.isVisible();
  await expect(visible).toBeTruthy();
})();
```

#### Related Methods

- [`.waitToBeVisible(options?: Object) => Promise`](./waitToBeVisible.md)

#### Related Docs

- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)