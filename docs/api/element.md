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

:white_check_mark: [```.tap() => Element```](./element/tap.md)

TODO: Description here.

:hammer: [```.longPress(duration?: Number) => Element```](./element/longPress.md)

TODO: Description here.

:hammer: [```.typeText(text: String) => Element```](./element/typeText.md)

TODO: Description here.

:hammer: [```.replaceText(text: String) => Element```](./element/replaceText.md)

TODO: Description here.

:hammer: [```.clearText() => Element```](./element/clearText.md)

TODO: Description here.

:warning: [```.scrollIntoView() => Element```](./element/scrollIntoView.md)

TODO: Description here.

:hammer: [```.attribute() => Element```](./element/attribute.md)

TODO: Description here.

:white_check_mark: [```.waitToBeVisible() => Element```](./element/waitToBeVisible.md)

TODO: Description here.

:white_check_mark: [```.waitToExist() => Element```](./element/waitToExist.md)

TODO: Description here.

:hammer: [```.findElement() => Element```](./element/findElement.md)

TODO: Description here.

:hammer: [```.findElements() => Element```](./element/findElements.md)

TODO: Description here.

:warning: [```.swipeUp({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeUp.md)

TODO: Description here.

:warning: [```.swipeDown({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeDown.md)

TODO: Description here.

:warning: [```.swipeLeft({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeLeft.md)

TODO: Description here.

:warning: [```.swipeRight({distance?: Number, duration?: Number, offsetX?: Number, offsetY?: Number}) => Element```](./element/swipeRight.md)

TODO: Description here.