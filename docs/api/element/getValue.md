# `.getValue(options?: Object) => Promise<Number | String | Boolean>`

Retrieves value property of element.

#### Parameters

1. `options` (`Object?`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).

#### Returns

`Promise` (`Number | String | Boolean`): Element value property.

#### Examples

Text input:

```javascript
(async () => {
  const value = await element(by.label("text-input"))
    .getValue();

  await expect(value).toEqual("Hello World!");
})();
```

Switch:

```javascript
(async () => {
  const value = await element(by.label("switch"))
    .getValue();

  await expect(value).toEqual(true);
})();
```

Slider:

```javascript
(async () => {
  const value = await element(by.label("slider"))
    .getValue({ sliderRange: [0, 5] });

  await expect(value).toEqual(2.5);
})();
```

#### Related methods

- [`.getText(options?: Object) => Promise<String>`](./getText.md)

### Related Appium Docs

- [Get Element Text (Android)](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Element Value (iOS)](http://appium.io/docs/en/commands/element/attributes/value/)