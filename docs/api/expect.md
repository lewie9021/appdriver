# Expect

The `expect` utility is the out-of-the-box solution for asserting within tests. It is heavily inspired by Jest, favouring a sane autocomplete system.

 ### Examples
 
```javascript
 (async () => {
   const $input = await element(by.label("input"));
   
   await expect($input).toHaveValue("Example Text");
 })();
```
 
```javascript
  (async () => {
    const $input = await element(by.label("input"));
    
    await expect($input).toExist();
  })();
```

```javascript
  (async () => {
    const $input = await element(by.label("input"));
    
    await expect($input).not.toBeVisible();
  })();
```

### Expect API

[```.not => Expect```](./expect/not.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Inverts the chained assertion to test the opposite.

[```.toHaveValue(value: Any, options?: Object) => Promise```](./expect/toHaveValue.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the element has a value strictly equal to `value`.

[```.toHaveText(text: String | Regex, options?: Object) => Promise```](./expect/toHaveText.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the element has text matching `text`.

[```.toBeDisabled() => Promise```](./expect/toBeDisabled.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the element is disabled.

[```.toExist() => Promise```](./expect/toExist.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the element exists.

[```.toBeVisible() => Promise```](./expect/toBeVisible.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the element is visible.

[```.toEqual(value: Any) => Promise```](./expect/toEqual.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the value is strictly equal to `value`.

[```.toHaveLength(length: Number) => Promise```](./expect/toHaveLength.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the value has a length property equal to `length`.

[```.toBeTruthy() => Promise```](./expect/toBeTruthy.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the value is truthy.

[```.toBeFalsy() => Promise```](./expect/toBeFalsy.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the value is falsy.

[```.toMatch(pattern: Regex) => Promise```](./expect/toMatch.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Asserts the value matches against the `pattern`.

[```.toBeGreaterThanOrEqual(value: Number) => Promise```](./expect/toBeGreaterThanOrEqual.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.toBeGreaterThan(value: Number) => Promise```](./expect/toBeGreaterThan.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.toBeLessThanOrEqual(value: Number) => Promise```](./expect/toBeLessThanOrEqual.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.toBeLessThan(value: Number) => Promise```](./expect/toBeLessThan.md)

<img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.
