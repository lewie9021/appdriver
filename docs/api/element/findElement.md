# `.findElement(matcher: Matcher, options?: Object) => Element`

Retrieves matching element found within parent. Useful when a direct locator strategy isn't available unless scoped to an element.

#### Parameters

1. `matcher` ([`Matcher`](../matchers.md)): Matcher to define the locator strategy.
2. `options` (`Object?`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).

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

- [`.findElements(matcher: Matcher, options?: Object) => Array<Element>`](./findElements.md)
