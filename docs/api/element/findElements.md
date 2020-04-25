# `.findElements(matcher: Matcher, options?: Object) => Array<Element>`

Retrieves matching elements found within parent. Useful when a direct locator strategy isn't available unless scoped to an element.

#### Parameters

1. `matcher` ([`Matcher`](../matchers.md)): Matcher to define the locator strategy.
2. `options` (`Object?`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).

#### Returns

`Array` (`Element`): List of matching elements found within parent.

#### Examples

Find visible list items in scroll view:

```javascript
(async () => {
  const listItems = await element(by.label("scroll-view"))
    .findElements(by.label(/^list-item-\d+$/));

  await expect(listItems).toHaveLength(5);
})();
```

#### Related methods

- [`.findElement(matcher: Matcher, options?: Object) => Element`](./findElement.md)
