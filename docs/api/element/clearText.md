# `.clearText() => Element`

Wipes the contents of a text element.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Clear text input:

```javascript
(async () => {
  await element(by.label("text-input"))
    .clearText();
})();
```

#### Related methods

- [`.typeText(text: String) => Element`](./typeText.md)
