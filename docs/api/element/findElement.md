# `.findElement(matcher: Matcher) => Element`

Retrieves matching element found within parent. Useful when a direct locator strategy isn't available unless scoped to an element.

#### Parameters

1. `matcher` ([`Matcher`](./matchers.md)): Matcher to define the locator strategy.

#### Returns

`Element`: Matching element found within parent.

#### Examples

Find text element within button:

```javascript
(async () => {
  const $text = await element(by.label("button"))
    .findElement(by.label("button-text"));

  await expect($text).toHaveText("Press Me!");
})();
```

#### Related methods

- [`.findElements(matcher: Matcher) => Array<Element>`](./findElements.md)
