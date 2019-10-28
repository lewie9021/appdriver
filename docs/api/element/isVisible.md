# `.isVisible() => Promise<Boolean>`

Retrieves visibility status of element.

#### Returns

`Promise` (`Boolean`): Element visibility status.

#### Examples

Visibility status of button:

```javascript
(async () => {
  const visible = await element(by.label("button"))
    .isVisible();
})();
```

#### Related methods

- [`.exists() => Promise<Boolean>`](./exists.md)

### Related Appium Docs

- [Is Element Displayed](http://appium.io/docs/en/commands/element/attributes/displayed/)