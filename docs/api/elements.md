# Elements

:hammer: [```elements(matcher: Matcher) => Array<Element>```](./)

The `elements` function provides a way to select multiple elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.label` which finds elements by accessibility label.

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
  
  await $listItemOne.swipeLeft({distance: 250});
  await $listItemTwo.swipeLeft({distance: 250});
  
  await expect($listItemOne).not.toExist();
  await expect($listItemTwo).not.toExist();
})();
```
