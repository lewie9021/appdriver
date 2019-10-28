# `.typeText(text: String) => Element`

Using the virtual keyboard, types the given text into a text element.

#### Parameters

1. `text` (`String`): Text to type.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Basic text input.

```javascript
(async () => {
  await element(by.label("text-input"))
    .typeText("Hello World!");
})();
```

#### Related methods

- [`.clearText() => Element`](./clearText.md)

### Related Appium Docs

- [Send Keys](http://appium.io/docs/en/commands/element/actions/send-keys/)