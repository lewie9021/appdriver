# `element(matcher: Matcher) => Element`

The `element` instance provides a way to interact with elements on the screen. You will need to use a `matcher` object to define how elements are found. The most common is `by.label` which finds elements by accessibility label.

#### Parameters

1. `matcher` ([`Matcher`](./matchers.md)): Matcher object defining the element search query.

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

[```.tap(options?: Object) => Element```](./element/tap.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs tap gesture on element.

[```.longPress(options?: Object) => Element```](./element/longPress.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs long press gesture on element.

[```.typeText(text: String) => Element```](./element/typeText.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Using the virtual keyboard, types the given text into a text element.

[```.clearText() => Element```](./element/clearText.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Wipes the contents of a text element.

[```.tapReturnKey() => Element```](./element/tapReturnKey.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.getText(options?: Object) => Promise<String>```](./element/getText.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Retrieves inner text content of element.

[```.getValue(options?: Object) => Promise<Any>```](./element/getValue.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Dev-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" /> <img src="https://img.shields.io/badge/Tests-WIP-orange.svg" />

Retrieves value property of element.

[```.exists() => Promise<Boolean>```](./element/exists.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves existence status of element.

[```.isVisible() => Promise<Boolean>```](./element/isVisible.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves visibility status of element.

[```.isDisabled() => Promise<Boolean>```](./element/isDisabled.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves disabled status of element.

[```.getLocation(options?: Object) => Promise<Object>```](./element/getLocation.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves x and y coordinates of element.

[```.getSize() => Promise<Object>```](./element/getSize.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Retrieves width and height dimensions of element.

[```.takeScreenshot(options?: Object) => Promise<Buffer>```](./element/takeScreenshot.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Takes a screenshot (PNG) of the element within the viewport and saves the result on disk at the given `filePath` location.

[```.waitFor(conditionFn: Function<Promise>, options?: Object) => Element```](./element/waitFor.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Polls `conditionFn` every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.waitToBeVisible(options?: Object) => Element```](./element/waitToBeVisible.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Polls for element to be visible every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.waitToBeInvisible(options?: Object) => Element```](./element/waitToBeInvisible.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Polls for element to be invisible every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.waitToExist(options?: Object) => Element```](./element/waitToExist.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Polls for element to exist every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.waitToNotExist(options?: Object) => Element```](./element/waitToExist.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-WIP-orange.svg" />

Polls for element to not exist every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

[```.findElement(matcher: Matcher) => Element```](./element/findElement.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.findElements(matcher: Matcher) => Array<Element>```](./element/findElements.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

TODO: Description here.

[```.swipe(options: Object) => Element```](./element/swipe.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe gesture on the element.

[```.swipeUp(options: Object) => Element```](./element/swipeUp.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe up gesture on the element.

[```.swipeDown(options: Object) => Element```](./element/swipeDown.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe down gesture on the element.

[```.swipeLeft(options: Object) => Element```](./element/swipeLeft.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe left gesture on the element.

[```.swipeRight(options: Object) => Element```](./element/swipeRight.md)

<img src="https://img.shields.io/badge/Platform-Both-blue.svg" />

Performs a swipe right gesture on the element.
