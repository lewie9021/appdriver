# `by.type(type: String) => Matcher`

Find element(s) by their type.

#### Returns

`Matcher`: A matcher to be used when finding elements.

#### Examples

Find an iOS text input.

```javascript
(async () => {
  const $input = await element(by.type("XCUIElementTypeTextField"));
})();
```

Find an Android switch element.

```javascript
(async () => {
  const $switch = await element(by.type("android.widget.Switch"));
})();
```