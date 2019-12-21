# `by.label(label: String | Regex) => Matcher`

Find element(s) by their accessibility label. For Android this is the `content-desc` attribute, whereas for iOS it's the `name` attribute.

#### Returns

`Matcher`: A matcher to be used when finding elements.

#### Examples

Find an element with a label of "text-input".

```javascript
(async () => {
  const $textInput = await element(by.label("text-input"));
})();
```

Find multiple elements with a label starting with "list-item-".

```javascript
(async () => {
  const $listItems = await elements(by.label(/^list-item-.*$/));
})();
```

#### Related methods

- [`by.id(id: String | Regex) => Matcher`](./byId.md)