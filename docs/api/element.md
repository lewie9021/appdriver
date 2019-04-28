# Element

The `element` instance provides a way to interact with elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.label` which finds elements by accessibility id.

### Examples

```javascript
(async () => {
  const $element = await element(by.label("search-input"))
    .typeText("Example Text");
  
  await expect($element).toHaveValue("Example Text");
})();
```

```javascript
(async () => {
  await element(by.label("scroll-view"))
    .swipeUp({distance: 100});
})();
```
### Element API

:white_check_mark: [```.tap({x?: Number, y?: Number}) => Element```](./element/tap.md)

TODO: Description here.

:white_check_mark: [```.longPress({x?: Number, y?: Number, duration?: Number}) => Element```](./element/longPress.md)

TODO: Description here.

:white_check_mark: [```.typeText(text: String) => Element```](./element/typeText.md)

TODO: Description here.

:white_check_mark: [```.clearText() => Element```](./element/clearText.md)

TODO: Description here.

:white_check_mark: [```.getLocation({relative: Boolean}) => {x: Number, y: Number}```](./element/getLocation.md)

TODO: Description here.

:white_check_mark: [```.getSize() => {width: Number, height: Number}```](./element/getSize.md)

TODO: Description here.

:warning: [```.getAttribute(attribute: String) => Element```](./element/getAttribute.md)

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

:hammer: [```.swipeUp({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeUp.md)

TODO: Description here.

:hammer: [```.swipeDown({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeDown.md)

TODO: Description here.

:hammer: [```.swipeLeft({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeLeft.md)

TODO: Description here.

:hammer: [```.swipeRight({x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeRight.md)

TODO: Description here.

:hammer: [```.swipe({x: Number, y: Number, direction: Number, distance: Number, duration?: Number}) => Element```](./device/swipe.md)

TODO: Description here.