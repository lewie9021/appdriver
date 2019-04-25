# Element

The `element` instance provides a way to interact with elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.id` which finds elements by testId.

### Examples

```javascript
(async () => {
  const $element = await element(by.id("search-input"))
    .typeText("Example Text");
  
  await expect($element).toHaveValue("Example Text");
})();
```

```javascript
(async () => {
  await element(by.id("scroll-view"))
    .swipeUp({distance: 100});
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

:hammer: [```.getLocation() => {x: Number, y: Number}```](./element/getLocation.md)

TODO: Description here.

:hammer: [```.getSize() => {width: Number, height: Number}```](./element/getSize.md)

TODO: Description here.

:hammer: [```.getAttribute(attribute: String) => Element```](./element/getAttribute.md)

TODO: Description here.

:hammer: [```.waitFor(factory: () => Promise<Boolean>, options?: {interval?: Number, maxRetries?: Number}) => Element```](./element/waitFor.md)

TODO: Description here.

:hammer: [```.waitToBeVisible(options?: {interval?: Number, maxRetries?: Number}) => Element```](./element/waitToBeVisible.md)

TODO: Description here.

:hammer: [```.waitToExist(options; {interval?: Number, maxRetries?: Number}) => Element```](./element/waitToExist.md)

TODO: Description here.

:hammer: [```.findElement(matcher: Matcher) => Element```](./element/findElement.md)

TODO: Description here.

:hammer: [```.findElements(matcher: Matcher) => Element```](./element/findElements.md)

TODO: Description here.

:warning: [```.swipeUp({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./element/swipeUp.md)

TODO: Description here.

:warning: [```.swipeDown({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./element/swipeDown.md)

TODO: Description here.

:warning: [```.swipeLeft({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./element/swipeLeft.md)

TODO: Description here.

:warning: [```.swipeRight({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./element/swipeRight.md)

TODO: Description here.