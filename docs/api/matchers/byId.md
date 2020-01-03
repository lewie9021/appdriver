# `by.id(id: String | Regex) => Matcher`

Find element(s) by their ID. For Android this is the `resource-id` attribute, whereas for iOS it's the `name` attribute.

#### Returns

`Matcher`: A matcher to be used when finding elements.

#### Examples

Find an element with an id of "button".

```javascript
(async () => {
  const $button = await element(by.id("button"));
})();
```

Find multiple elements with an id starting with "list-item-".

```javascript
(async () => {
  const $listItems = await elements(by.id(/^list-item-.*$/));
})();
```

#### Related methods

- [`by.label(id: String | Regex) => Matcher`](./byLabel.md)