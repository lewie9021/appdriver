# `.not => Expect`

Inverts the chained assertion to test the opposite.

#### Returns

`Expect`: An Expect instance to allow function chaining.

#### Examples

Not visible:

```javascript
(async () => {
  await expect(element(by.label("button"))).not.toBeVisible();
})();
```

Not equal:

```javascript
(async () => {
  await expect(element(by.label("text-input"))).not.toEqual("Hello World!");
})();
```

Not focused:

```javascript
(async () => {
  await expect(element(by.label("text-input"))).not.toBeFocused();
})();
```
