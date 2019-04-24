# Element

The `element` instance provides a way to interact with elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.id` which finds elements by testId.

### Examples

```javascript
(async () => {
  const $element = await element(by.id("search-input"))
    .scrollIntoView()
    .tap()
    .typeText("Example Text");
  
  await expect($element).toHaveValue("Example Text");
})();
```

### Element API

[```.tap() => Element```](./element/tap.md)

TODO: Description here.

[```.longPress(duration?: Number) => Element```](./element/longPress.md)

TODO: Description here.

[```.typeText(text: String) => Element```](./element/typeText.md)

TODO: Description here.

[```.replaceText(text: String) => Element```](./element/replaceText.md)

TODO: Description here.

[```.clearText() => Element```](./element/clearText.md)

TODO: Description here.

[```.scrollIntoView() => Element```](./element/scrollIntoView.md)

TODO: Description here.

[```.attribute() => Element```](./element/attribute.md)

TODO: Description here.

[```.waitToBeVisible() => Element```](./element/waitToBeVisible.md)

TODO: Description here.

[```.waitToExist() => Element```](./element/waitToExist.md)

TODO: Description here.

[```.findElement() => Element```](./element/findElement.md)

TODO: Description here.

[```.findElements() => Element```](./element/findElements.md)

TODO: Description here.

[```.swipeUp({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeUp.md)

TODO: Description here.

[```.swipeDown({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeDown.md)

TODO: Description here.

[```.swipeLeft({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeLeft.md)

TODO: Description here.

[```.swipeRight({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeRight.md)

TODO: Description here.