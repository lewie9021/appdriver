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

#### Related Appium Docs

- [Find Element](http://appium.io/docs/en/commands/element/find-element/)