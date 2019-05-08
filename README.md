# AppDriver

A mobile focused, intuitive Appium client.

### Goal

The goal of this project is to offer a mobile focused E2E testing framework that's "batteries included". It should provide a familiar interface for running tests, an assertion library orientated around E2E testing, and first class support for common operations.

### Motivation

After using [WebdriverIO](https://github.com/webdriverio/webdriverio) for several months on a real world project, I found it was frustrating to perform even basic tasks without first spending hours trying to figure out the correct syntax, before working on a solution that often required writing my own helper function(s).

I initially started this project as a proof of concept, taking inspiration from [Detox](https://github.com/wix/Detox), [WebdriverIO](https://github.com/webdriverio/webdriverio), [WD.js](https://github.com/admc/wd), and [Jest](https://github.com/facebook/jest). I really liked the syntactic style of [Detox](https://github.com/wix/Detox) and wanted to see how it might look when paired with the ([Mobile](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md)) [JSON Wire Protocol](https://w3c.github.io/webdriver/).

Unlike Appium based clients, [Detox](https://github.com/wix/Detox) is yet to support running tests in the cloud and on [real iOS devices](https://github.com/wix/detox/issues/95). For me, this was a limitation I simply couldn't ignore. I feel it's critical in ensuring tests run quickly and provide the confidence that the application works as expected on a variety of real devices.

### Examples

##### Tap interaction

```javascript
(async () => {
  await element(by.label("button")).tap();
})();
```

##### Text entry

```javascript
(async () => {
  const $textInput = await element(by.label("text-input"));
  
  await $textInput
    .tap()
    .typeText("Hello World!");
  
  await expect($textInput).toHaveValue("Hello World!");
})();
```

##### Swipe gesture

```javascript
(async () => {
  await element(by.label("carousel-container"))
    .swipeLeft({percentage: 0.75});
  
  await expect(element(by.label("carousel-page-2"))).toBeVisible();
})();
```

##### Fuzzy match elements

```javascript
(async () => {
  const $items = await elements(by.label("list-item-*"));
  
  await expect($items).toHaveLength(3);
})();
```

##### Custom gestures

```javascript
(async () => {
  const $box = await element(by.label("box"));
  const $destination = await element(by.label("destination"));
  const dragAndDrop = gestures.create()
    .press({element: $box})
    .wait(250)
    .moveTo({element: $destination})
    .release();
  
  await device.performGesture(dragAndDrop);
})();
```

### Documentation

- [Introduction](./docs)
- [Getting Started](./docs/getting-started)
  - [Installing Appium](./docs/installing-appium.md)
  - [Installing AppDriver](./docs/installing-appdriver.md)
- [Guides](./docs/guides)
  - [Finding Elements](./docs/guides/finding-elements.md)
- [API Reference](./docs/api)
  - [Matchers](./docs/api/matchers.md)
  - [Element](./docs/api/element.md)
  - [Elements](./docs/api/elements.md)
  - [Device](./docs/api/device.md)
  - [Gestures](./docs/api/gestures.md)
  - [Expect](./docs/api/expect.md)
- [Change Log](./CHANGELOG.md)

### TODOs

- [ ] Support for parallel testing.
- [ ] Support for multiple capabilities.
- [ ] Host documentation on github.io.