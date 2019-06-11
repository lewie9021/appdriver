# `.exists() => Promise<Boolean>`

Retrieve existence status of element.

#### Returns

`Promise` (`Boolean`): Element existence status.

#### Examples

Existence status of button:

```javascript
(async () => {
  const exists = await element(by.label("button"))
    .exists();
})();
```

#### Related methods

- [`.isVisible() => Promise<Boolean>`](./isVisible.md)
