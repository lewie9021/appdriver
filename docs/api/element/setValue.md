# `.setValue(value: Any) => Element`

Replaces element value, clearing existing input.

#### Parameters

1. `value` (`Any`): Value to replace with.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Text input:

```javascript
(async () => {
  const $input = await element(by.label("text-input"));

  $input.setValue("Hello World!");
  await expect($input).toHaveValue("Hello World!");
})();
```

Slider:

```javascript
(async () => {
  const $slider = await element(by.label("slider"), { sliderRange: [ 0, 10 ]});

  await $slider.setValue(5);
  await expect($slider).toHaveValue(5);
})();
```

#### Known Issues

- iOS simulators fail to input text when the hardware keyboard is connected. Ensure `Hardware > Keyboard > Connect Hardware Keyboard` is unchecked.

#### Related methods

- [`.typeText(text: String) => Element`](./typeText.md)
- [`.clearText() => Element`](./clearText.md)

#### Related Appium Docs

- [Send Keys](http://appium.io/docs/en/commands/element/actions/send-keys/)
- [Clear Element](http://appium.io/docs/en/commands/element/actions/clear/)
