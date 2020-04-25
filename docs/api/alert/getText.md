# `.getText() => Promise<String>`

Retrieves text content of a native alert. If an alert is not visible, an error will be thrown.

#### Returns

`Promise` (`String`): Alert text contents.

#### Examples

```javascript
(async () => {
  const text = await alert.getText();

  expect(text).toEqual([
    "Alert", // Title
    "Hello World!" // Description
  ].join("\n"))
})();
```

#### Known Issues

- In a scenario where alerts stack, text of the alert opened first will be returned. This is behaviour that comes directly from Appium.

#### Related Methods

- [`.isVisible() => Promise<Boolean>`](./isVisible.md)

#### Related Docs

- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)