# `.setValue(value: String) => Promise`

Replaces alert value, clearing existing input.

#### Parameters

1. `value` (`String`): Value to replace with.

#### Returns

`Promise`: A promise that resolves once value has been set.

#### Examples

```javascript
(async () => {
  await alert.setValue("Hello World!");
})();
```

#### Related methods

- [`.getText() => Promise<String>`](./getText.md)
- [`.isVisible() => Promise<Boolean>`](./isVisible.md)

#### Related Docs

- [Send Alert Text (W3C)](https://www.w3.org/TR/webdriver/#send-alert-text)