# `.toEqual(value: Any) => Promise`

Asserts the value is strictly equal to `value`.

#### Parameters

1. `value` (`Any`): Value to compare against.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Numeric:

```javascript
(async () => {
  await expect(5).toEqual(5);
})();
```

String:

```javascript
(async () => {
  await expect("Hello World!").toEqual("Hello World!");
})();
```

Promise:

```javascript
(async () => {
  const $box = await element(by.label("box"));

  await expect($box.getSize()).toEqual({ width: 100, height: 100 });
})();
```

#### Related methods

- [`.toMatch(pattern: Regex) => Promise`](./toMatch.md)
