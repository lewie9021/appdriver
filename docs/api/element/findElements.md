# `.findElements(matcher: Matcher) => Array<Element>`

Retrieves matching elements found within parent. Useful when a direct locator strategy isn't available unless scoped to an element.

#### Parameters

1. `matcher` ([`Matcher`](./matchers.md)): Matcher to define the locator strategy.

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

- [`.findElement(matcher: Matcher) => Element`](./findElement.md)
