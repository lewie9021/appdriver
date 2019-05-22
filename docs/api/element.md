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

:white_check_mark: :hammer: [```.tap(options?: Options) => Element```](./element/tap.md)

Performs tap gesture on element.

:white_check_mark: [```.longPress(options?: Options) => Element```](./element/longPress.md)

Performs long press gesture on element.

:white_check_mark: [```.typeText(text: String) => Element```](./element/typeText.md)

Using the virtual keyboard, types the given text into a text element.

:warning: [```.replaceText(text: String) => Element```](./element/replaceText.md)

TODO: Description here.

:white_check_mark: [```.clearText() => Element```](./element/clearText.md)

Wipes the contents of a text element.

:white_check_mark: [```.getText() => Promise<String>```](./element/getText.md)

Retrieves inner text content of element.

:white_check_mark: :hammer: [```.getValue() => Promise<Any>```](./element/getValue.md)

Retrieves value property of element.

:hammer: [```.exists() => Promise<Boolean>```](./element/exists.md)

Retrieves existence status of element.

:white_check_mark: [```.isVisible() => Promise<Boolean>```](./element/isVisible.md)

Retrieves visibility status of element.

:warning: [```.isEnabled() => Promise<Boolean>```](./element/isEnabled.md)

TODO: Description here.

:warning: [```.isSelected() => Promise<Boolean>```](./element/isSelected.md)

TODO: Description here.

:white_check_mark: [```.getLocation(options?: Object) => Promise<Object>```](./element/getLocation.md)

Retrieves x and y coordinates of element.

:white_check_mark: [```.getSize() => Promise<Object>```](./element/getSize.md)

Retrieves width and height dimensions of element.

:hammer: [```.getAttribute(attribute: String) => Promise<Any>```](./element/getAttribute.md)

TODO: Description here.

:hammer: [```.waitFor(condition: () => Promise, options?: {interval?: Number, maxDuration?: Number}) => Element```](./element/waitFor.md)

TODO: Description here.

:white_check_mark: :hammer: [```.waitToBeVisible(options?: Object) => Element```](./element/waitToBeVisible.md)

TODO: Description here.

:warning: [```.waitToBeInvisible(options?: {interval?: Number, maxDuration?: Number}) => Element```](./element/waitNotToBeVisible.md)

TODO: Description here.

:white_check_mark: :hammer: [```.waitToExist(options?: Object) => Element```](./element/waitToExist.md)

TODO: Description here.

:warning: [```.waitToNotExist(options?: {interval?: Number, maxDuration?: Number}) => Element```](./element/waitToExist.md)

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

