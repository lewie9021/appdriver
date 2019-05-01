# Expect

The `expect` utility is the out-of-the-box solution for asserting within tests. It is heavily inspired by Jest, favouring a sane autocomplete system.

 ### Examples
 
```javascript
 (async () => {
   const $input = await element(by.id("input"));
   
   await expect($input).toHaveValue("Example Text");
 })();
```
 
```javascript
  (async () => {
    const $input = await element(by.id("input"));
    
    await expect($input).toExist();
  })();
```

```javascript
  (async () => {
    const $input = await element(by.id("input"));
    
    await expect($input).not.toBeVisible();
  })();
```

### Expect API (Element)

:hammer: [```.not => Expect```](./expect/not.md)

TODO: Description here.

:hammer: [```.toHaveValue(value: String | Number) => Promise```](./expect/toHaveValue.md)

TODO: Description here.

:hammer: [```.toHaveText(text: String) => Promise```](./expect/toHaveText.md)

TODO: Description here.

:hammer: [```.toHaveValueGreaterThenOrEqual(value: Number) => Promise```](./expect/toHaveValueGreaterThenOrEqual.md)

TODO: Description here.

:hammer: [```.toHaveValueGreaterThan(value: Number) => Promise```](./expect/toHaveValueGreaterThan.md)

TODO: Description here.

:hammer: [```.toHaveValueLessThanOrEqual(value: Number) => Promise```](./expect/toHaveValueGreaterThenOrEqual.md)

TODO: Description here.

:hammer: [```.toHaveValueLessThan(value: Number) => Promise```](./expect/toHaveValueLessThan.md)

TODO: Description here.

:hammer: [```.toHaveTextContain(text: String) => Promise```](./expect/toHaveTextContain.md)

TODO: Description here.

:hammer: [```.toHaveTextMatch(pattern: Regex) => Promise```](./expect/toHaveTextMatch.md)

TODO: Description here.

:hammer: [```.toHaveAttribute(attribute: String, value: String|Number) => Promise```](./expect/toHaveAttribute.md)

TODO: Description here.

:hammer: [```.toExist() => Promise```](./expect/toExist.md)

TODO: Description here.

:hammer: [```.toBeVisible() => Promise```](./expect/toBeVisible.md)

TODO: Description here.

### Expect API (Value)

:hammer: [```.toHaveLength(value: Number) => Promise```](./expect/toHaveLength.md)

TODO: Description here.

:hammer: [```.toEqual(value: any) => Promise```](./expect/toEqual.md)

TODO: Description here.

:hammer: [```.toContain(value: any) => Promise```](./expect/toContain.md)

TODO: Description here.

:hammer: [```.toMatch(pattern: Regex) => Promise```](./expect/toMatch.md)

TODO: Description here.

:hammer: [```.toBeGreaterThenOrEqual(value: Number) => Promise```](./expect/toBeGreaterThenOrEqual.md)

TODO: Description here.

:hammer: [```.toBeGreaterThan(value: Number) => Promise```](./expect/toBeGreaterThan.md)

TODO: Description here.

:hammer: [```.toBeLessThanOrEqual(value: Number) => Promise```](./expect/toBeLessThanOrEqual.md)

TODO: Description here.

:hammer: [```.toBeLessThan(value: Number) => Promise```](./expect/toBeLessThan.md)

TODO: Description here.