# Element

:white_check_mark: [```element(matcher: Matcher) => Element```](./)

The `element` instance provides a way to interact with elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.label` which finds elements by accessibility label.

#### Parameters

1. `matcher` ([Matcher](./matchers.md)): Matcher object defining the element search query.

#### Examples

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
#### Element API

:white_check_mark: :hammer: [```.tap(options? {x?: Number, y?: Number}) => Element```](./element/tap.md)

Performs tap gesture on element.

:white_check_mark: [```.longPress(options?: {x?: Number, y?: Number, duration?: Number}) => Element```](./element/longPress.md)

Performs long press gesture on element.

:white_check_mark: [```.typeText(text: String) => Element```](./element/typeText.md)

Using the virtual keyboard, types the given text into a text element.

:warning: [```.replaceText(text: String) => Element```](./element/replaceText.md)

TODO: Description here.

:white_check_mark: [```.clearText() => Element```](./element/clearText.md)

Wipes the contents of a text element.

:white_check_mark: [```.getText() => String```](./element/getText.md)

Retrieves inner text content of element.

:white_check_mark: :hammer: [```.getValue() => Any```](./element/getValue.md)

Retrieves value property of element.

:hammer: [```.exists() => Boolean```](./element/exists.md)

Retrieves existence status of element.

:white_check_mark: [```.isVisible() => Boolean```](./element/isVisible.md)

Retrieves visibility status of element.

:warning: [```.isEnabled() => Boolean```](./element/isEnabled.md)

TODO: Description here.

:warning: [```.isSelected() => Boolean```](./element/isSelected.md)

TODO: Description here.

:white_check_mark: [```.getLocation(options?: {relative?: Boolean}) => {x: Number, y: Number}```](./element/getLocation.md)

Retrieves x and y coordinates of element.

:white_check_mark: [```.getSize() => {width: Number, height: Number}```](./element/getSize.md)

Retrieves width and height dimensions of element.

:hammer: [```.getAttribute(attribute: String) => Any```](./element/getAttribute.md)

TODO: Description here.

:hammer: [```.waitFor(factory: () => Promise<Boolean>, options?: {interval?: Number, maxRetries?: Number}) => Element```](./element/waitFor.md)

TODO: Description here.

:white_check_mark: [```.waitToBeVisible(options?: {interval?: Number, maxRetries?: Number}) => Element```](./element/waitToBeVisible.md)

TODO: Description here.

:white_check_mark: [```.waitToExist(options?: {interval?: Number, maxRetries?: Number}) => Element```](./element/waitToExist.md)

TODO: Description here.

:hammer: [```.findElement(matcher: Matcher) => Element```](./element/findElement.md)

TODO: Description here.

:hammer: [```.findElements(matcher: Matcher) => Array<Element>```](./element/findElements.md)

TODO: Description here.

:hammer: [```.swipeUp(options: {x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeUp.md)

TODO: Description here.

:hammer: [```.swipeDown(options: {x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeDown.md)

TODO: Description here.

:hammer: [```.swipeLeft(options: {x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeLeft.md)

TODO: Description here.

:hammer: [```.swipeRight(options: {x: Number, y: Number, distance: Number, duration?: Number}) => Element```](./device/swipeRight.md)

TODO: Description here.

:hammer: [```.swipe(options: {x: Number, y: Number, direction: Number, distance: Number, duration?: Number}) => Element```](./device/swipe.md)

TODO: Description here.

:warning: [```.swipeIntoView(options: {element: Element, swipeGesture?: Gesture, safeArea?: {top?: Number, right?: Number, bottom?: Number, left?: Number}}) => Element```](./device/swipeIntoView.md)

To be used on scrollable elements, ensuring `element` is fully visible so that interactions are successful. Defaults `swipeGesture` to `gestures.swipeUp`.

