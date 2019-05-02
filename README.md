# AppDriver

A mobile focused, intuitive Appium client.

### Examples

##### Element selection with tap interaction.

```javascript
(async () => {
  const $button = await element(by.label("button"));
  
  await $button.tap();
})();
```

##### Element selection with text entry.

```javascript
(async () => {
  const $textInput = await element(by.label("text-input"));
  
  await $textInput.typeText("Hello World!");
})();
```

### Documentation

- [Introduction](./docs)
- [Guides](./docs/guides)
  - [Installation](./docs/guides/installation.md)
  - [Finding Elements](./docs/guides/finding-elements.md)
- [API Reference](./docs/api)
  - [Device](./docs/api/device.md)
  - [Matchers](./docs/api/matchers.md)
  - [Element](./docs/api/element.md)
  - [Elements](./docs/api/elements.md)
  - [Gestures](./docs/api/gestures.md)
  - [Expect](./docs/api/expect.md)

### TODOs

- [ ] Support for parallel testing.
- [ ] Support for multiple capabilities.
- [ ] Host documentation on github.io.