# `.waitToBeVisible(options?: Object) => Promise`

Polls for an alert to be visible every `options.interval` until found or exceeds `options.maxDuration` timeout.

#### Parameters

1. `options` (`Object?`):
    - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to [`waitForInterval`](../configuration.md).
    - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll before throwing. Defaults to [`waitForTimeout`](../configuration.md).

#### Returns

`Promise`: A promise that resolves once an alert is visible.

#### Examples

```javascript
(async () => {
  await element(by.label("button")).tap();
  await alert.waitToBeVisible();
  await alert.accept();
})();
```

#### Related methods

- [`.isVisible() => Promise<Boolean>`](./isVisible.md)

#### Related Docs

- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)