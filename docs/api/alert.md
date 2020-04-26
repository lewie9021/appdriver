# Alert

The `alert` object provides a way of interacting with native alerts.

### Examples

```javascript
(async () => {
  await element(by.label("button")).tap();
  
  await alert.waitToBeVisible();

  await expect(alert.getText()).toEqual([
    "Alert",
    "Hello World!"
  ].join("\n"));

  await alert.accept();

  await expect(alert.isVisible()).toBeFalsy();
})();
```

### Alert API

[```.accept() => Promise```](./alert/accept.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

Attempts to accept a native alert.

[```.dismiss() => Promise```](./alert/dismiss.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

Attempts to dismiss a native alert.

[```.getText() => Promise<String>```](./alert/getText.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

Retrieves text content of a native alert.

[```.setValue(text: String) => Promise```](./alert/setValue.md)

<img src="https://img.shields.io/badge/Platform-iOS-blue.svg" />

Replaces alert value, clearing existing input.

[```.isVisible() => Promise<Boolean>```](./alert/isVisible.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

Returns whether an alert is visible.

[```.waitToBeVisible(options?: Object) => Promise```](./alert/waitToBeVisible.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

Polls for an alert to be visible every `options.interval` until found or exceeds `options.maxDuration` timeout.