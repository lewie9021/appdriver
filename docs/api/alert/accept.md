# `.accept() => Promise`

Attempts to accept a native alert. If an alert is not visible, an error will be thrown.

#### Returns

`Promise`: A promise that resolves once the alert has been accepted and no longer visible.

#### Examples

```javascript
(async () => {
  await element(by.label("button")).tap();
  await alert.waitToBeVisible();
  await alert.accept();

  return expect(alert).not.toBeVisible();
})();
```

#### Known Issues

- In a scenario where alerts stack, all alerts will be accepted (not just the top one). This is behaviour that comes directly from Appium.

#### Related methods

- [`.dismiss() => Promise`](./dismiss.md)
- [`.isVisible() => Promise<Boolean>`](./isVisible.md)
- [`.waitToBeVisible(options?: Object) => Promise`](./waitToBeVisible.md)

#### Related Docs

- [Accept Alert (W3C)](https://www.w3.org/TR/webdriver/#accept-alert)
- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)