# `.clearText() => Element`

Wipes the contents of a text element.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Clear text input:

```javascript
(async () => {
  const $input = await element(by.label("text-input"))
    .clearText();

  await expect($input).toHaveValue("");
})();
```

#### Known Issues

- iOS simulators fail to clear text when the hardware keyboard is connected. Ensure `Hardware > Keyboard > Connect Hardware Keyboard` is unchecked.
- Inputs fail to clear when using Xcode 11.x and iOS 12.x and below: ([GitHub issue](https://github.com/appium/appium/issues/13288)).

#### Related methods

- [`.setValue(value: Any) => Element`](./setValue.md)
- [`.typeText(text: String) => Element`](./typeText.md)

#### Related Appium Docs

- [Clear Element](http://appium.io/docs/en/commands/element/actions/clear/)
