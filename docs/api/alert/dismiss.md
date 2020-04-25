# `.dismiss() => Promise`

Attempts to dismiss a native alert. If an alert is not visible, an error will be thrown.

#### Returns

`Promise`: A promise that resolves once the alert has been dismissed and no longer visible.

#### Examples

```javascript
(async () => {
  await element(by.label("button")).tap();
  await device.waitFor(() => expect(alert.isVisible()).toBeTruthy());
  await alert.dismiss();

  return expect(alert.isVisible()).toBeFalsy();
})();
```

#### Known Issues

- In a scenario where alerts stack, all alerts will be dismissed (not just the top one). This is behaviour that comes directly from Appium.

#### Related methods

- [`.accept() => Promise`](./accept.md)
- [`.isVisible() => Promise<Boolean>`](./isVisible.md)

#### Related Docs

- [Dismiss Alert (W3C)](https://www.w3.org/TR/webdriver/#dismiss-alert)