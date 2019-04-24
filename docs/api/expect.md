# Expect

The `expect` utility is the out-of-the-box solution for asserting within tests. It is heavily inspired by Jest that favours a sane autocomplete system.

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

### Expect API

:hammer: [```.toHaveValue(value: String) => Promise```](./expect/toHaveValue.md)

TODO: Description here.

:hammer: [```.toHaveValueGreaterThan(value: Number) => Promise```](./expect/toHaveValueGreaterThan.md)

TODO: Description here.

:hammer: [```.toHaveValueLessThan(value: Number) => Promise```](./expect/toHaveValueLessThan.md)

TODO: Description here.

:hammer: [```.toContainValue(text: String) => Promise```](./expect/toContainValue.md)

TODO: Description here.

:hammer: [```.toHaveAttribute(attribute: String, value: String|Number) => Promise```](./expect/toHaveAttribute.md)

TODO: Description here.

:hammer: [```.toExist(text: String) => Promise```](./expect/toExist.md)

TODO: Description here.

:hammer: [```.toBeVisible(text: String) => Promise```](./expect/toExist.md)

TODO: Description here.