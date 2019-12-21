# `by.text(text: String | Regex) => Matcher`

Find element(s) by their text value.

#### Returns

`Matcher`: A matcher to be used when finding elements.

#### Examples

Find an element with the text "Hello World!".

```javascript
(async () => {
  const $text = await element(by.text("Hello World!"));
})();
```

Find an element containing the text "Success".

```javascript
(async () => {
  const $text = await element(by.text(/Success/));
})();
```