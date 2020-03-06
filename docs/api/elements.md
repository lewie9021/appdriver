# `elements(matcher: Matcher, options?: Object) => Array<Element>`

The `elements` function provides a way to select multiple elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.label` which finds elements by accessibility label.

#### Parameters

1. `matcher` ([`Matcher`](./matchers.md)): Matcher to define the locator strategy.
2. `options` (`Object?`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).


### Examples

```javascript
(async () => {
  const $items = await elements(by.label("list-item"));
  
  await expect($items).toHaveLength(5);
})();
```

```javascript
(async () => {
  const [ $listItemOne, $listItemTwo ] = await elements(by.label("list-item"));
  
  await $listItemOne.swipeLeft({ distance: 250 });
  await $listItemTwo.swipeLeft({ distance: 250 });
  
  await expect($listItemOne).not.toExist();
  await expect($listItemTwo).not.toExist();
})();
```
