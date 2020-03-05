# `.toHaveValue(value: Any) => Promise`

Asserts the element has a value strictly equal to `value`.

#### Parameters

1. `value` (`Any`): Value to compare against the element's value.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Text input:

```javascript
(async () => {
  const $input = await element(by.label("text-input"));

  await expect($input).toHaveValue("Hello World!");
})();
```

Switch input:

```javascript
(async () => {
  const $input = await element(by.label("switch"));

  await expect($input).toHaveValue(true);
})();
```

Slider input:

```javascript
(async () => {
  const $input = await element(by.label("slider"), { sliderRange: [0, 10] });

  await expect($input).toHaveValue(5);
})();
```

#### Related methods

- [`.toHaveText(text: String | Regex, options?: Object) => Promise`](./toHaveText.md)

### Related Appium Docs

- [Get Element Text (Android)](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Element Value (iOS)](http://appium.io/docs/en/commands/element/attributes/value/)
