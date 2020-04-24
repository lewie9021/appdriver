# `.getValue() => Promise<Any>`

Retrieves value property of element.

#### Returns

`Promise` (`Any`): Element value property.

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
  const value = await element(by.label("slider"), { sliderRange: [0, 5] })
    .getValue();

  await expect(value).toEqual(2.5);
})();
```

#### Related methods

- [`.getText(options?: Object) => Promise<String>`](./getText.md)

#### Related Appium Docs

- [Get Element Text (Android)](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Element Value (iOS)](http://appium.io/docs/en/commands/element/attributes/value/)
