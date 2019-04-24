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

[```.toHaveValue(value: String) => Promise```](./expect/toHaveValue.md)

TODO: Description here.

[```.toHaveValueGreaterThan(value: Number) => Promise```](./expect/toHaveValueGreaterThan.md)

TODO: Description here.

[```.toHaveValueLessThan(value: Number) => Promise```](./expect/toHaveValueLessThan.md)

TODO: Description here.

[```.toContainText(text: String) => Promise```](./expect/toContainText.md)

TODO: Description here.

[```.toHaveText(text: String) => Promise```](./expect/toHaveText.md)

TODO: Description here.

[```.toHaveAttribute(attribute: String, value: String|Number) => Promise```](./expect/toHaveAttribute.md)

TODO: Description here.

[```.toExist(text: String) => Promise```](./expect/toExist.md)

TODO: Description here.

[```.toBeVisible(text: String) => Promise```](./expect/toExist.md)

TODO: Description here.