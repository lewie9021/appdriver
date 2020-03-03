# `.toHaveValue(value: Any, options?: Object) => Promise`

Asserts the element has a value strictly equal to `value`.

#### Parameters

1. `value` (`String`): Value to compare against the element's value.
2. `options` (`Object`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Text input:

```javascript
(async () => {
  const $input = await element(by.label("text-input"))

  await expect($input).toHaveValue("Hello World!");
})();
```

Switch input:

```javascript
(async () => {
  const $input = await element(by.label("switch"))

  await expect($input).toHaveValue(true);
})();
```

Slider input:

```javascript
(async () => {
  const $input = await element(by.label("slider"))

  await expect($input).toHaveValue(5, { sliderRange: [0, 10] });
})();
```

#### Related methods

- [`.toHaveText(text: String | Regex, options?: Object) => Promise`](./toHaveText.md)

### Related Appium Docs

- [Get Element Text (Android)](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Element Value (iOS)](http://appium.io/docs/en/commands/element/attributes/value/)
