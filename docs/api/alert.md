# Alert

The `alert` object provides a way of interacting with native alerts.

### Examples

```javascript
(async () => {
  await element(by.label("button")).tap();
  
  await device.waitFor(() => expect(alert.isVisible()).toBeTruthy());

  await expect(alert.getText()).toEqual([
    "Alert",
    "Hello World!"
  ].join("\n"));

  await alert.accept();
})();
```

### Alert API

[```.accept() => Promise```](./alert/accept.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

Attempts to accept a native alert.

[```.dismiss() => Promise```](./alert/dismiss.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

TODO: Description here.

[```.getText() => Promise<String>```](./alert/getText.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

TODO: Description here.

[```.setValue(text: String) => Promise```](./alert/setValue.md)

<img src="https://img.shields.io/badge/Platform-iOS-blue.svg" />

TODO: Description here.

[```.isVisible() => Promise<Boolean>```](./alert/isVisible.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.