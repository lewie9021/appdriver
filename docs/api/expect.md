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

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Inverts the chained assertion to test the opposite.

##### Element

[```.toHaveValue(value: Any, options?: Object) => Promise```](./expect/toHaveValue.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the element has a value strictly equal to `value`.

[```.toHaveText(text: String) => Promise```](./expect/toHaveText.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the element has text exactly matching `text`.

[```.toBeDisabled() => Promise```](./expect/toBeDisabled.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

Asserts the element is disabled.

[```.toHaveValueGreaterThanOrEqual(value: Number) => Promise```](./expect/toHaveValueGreaterThanOrEqual.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Assets the element has a value greater than or equal to `value`.

[```.toHaveValueGreaterThan(value: Number) => Promise```](./expect/toHaveValueGreaterThan.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Assets the element has a value greater than `value`.

[```.toHaveValueLessThanOrEqual(value: Number) => Promise```](./expect/toHaveValueGreaterThanOrEqual.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Assets the element has a value less than or equal to `value`.

[```.toHaveValueLessThan(value: Number) => Promise```](./expect/toHaveValueLessThan.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Assets the element has a value less than `value`.

[```.toHaveTextContain(text: String) => Promise```](./expect/toHaveTextContain.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Assets the element has text containing `text`.

[```.toHaveTextMatch(pattern: Regex) => Promise```](./expect/toHaveTextMatch.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Asserts the element contains text that matches `pattern`.

[```.toHaveAttribute(attribute: String, value: Any) => Promise```](./expect/toHaveAttribute.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Asserts the element has `attribute` strictly equal to `value`.

[```.toExist() => Promise```](./expect/toExist.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

Asserts the element exists.

[```.toBeVisible() => Promise```](./expect/toBeVisible.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the element is visible.

##### Value

[```.toEqual(value: Any) => Promise```](./expect/toEqual.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the value is strictly equal to `value`.

[```.toHaveLength(length: Number) => Promise```](./expect/toHaveLength.md)

<img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Asserts the value has a length property equal to `length`.

[```.toBeTruthy() => Promise```](./expect/toBeTruthy.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Asserts the value is truthy.

[```.toBeFalsy() => Promise```](./expect/toBeFalsy.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Asserts the value is falsy.

[```.toContain(value: Any) => Promise```](./expect/toContain.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.toMatch(pattern: Regex) => Promise```](./expect/toMatch.md)

<img src="https://img.shields.io/badge/Dev-Done-green.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-Done-green.svg" />

TODO: Description here.

[```.toBeGreaterThanOrEqual(value: Number) => Promise```](./expect/toBeGreaterThanOrEqual.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.toBeGreaterThan(value: Number) => Promise```](./expect/toBeGreaterThan.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.toBeLessThanOrEqual(value: Number) => Promise```](./expect/toBeLessThanOrEqual.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.

[```.toBeLessThan(value: Number) => Promise```](./expect/toBeLessThan.md)

<img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

TODO: Description here.
