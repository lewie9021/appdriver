# AppDriver

A mobile focused, intuitive Appium client.

<img src="https://raw.githubusercontent.com/lewie9021/appdriver/master/docs/assets/demo.gif">

### Notice

**This project is currently in the Alpha stages of development**, meaning the API is subject to change and may be missing functionality detailed in the documentation. If you're interested in the project's roadmap, feel free to check out the [Projects tab](https://github.com/lewie9021/appdriver/projects).

### Goal

The goal of this project is to offer a mobile focused E2E testing framework that's "batteries included". It should provide a familiar interface for running tests, an assertion library orientated around E2E testing, and first class support for common operations.

### Motivation

After using [WebdriverIO](https://github.com/webdriverio/webdriverio) for several months on a real world project, I found it was frustrating to perform even basic tasks without spending hours figuring out the correct syntax, that often led to writing my own helper function(s).

I feel the major Appium based clients focus too heavily on the Web, giving the impression that mobile is an afterthought. As someone that's relatively new to mobile test automation, I was frequently forced down a trial and error path as the documentation was either sprase or simply non-existent.

Initially, I started this project as a proof of concept, taking inspiration from [Detox](https://github.com/wix/Detox), [WebdriverIO](https://github.com/webdriverio/webdriverio), [WD.js](https://github.com/admc/wd), and [Jest](https://github.com/facebook/jest). I really liked the syntactic style of [Detox](https://github.com/wix/Detox) and wanted to see how it might look when paired with the ([Mobile](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md)) [JSON Wire Protocol](https://w3c.github.io/webdriver/).

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
    .wait({duration: 250})
    .moveTo({element: $destination})
    .release();
  
  await device.performGesture(dragAndDrop);
})();
```

### Documentation

- [Introduction](./docs)
- [Installation](./docs/installation)
  - [Appium](./docs/installation/installing-appium.md)
  - [AppDriver](./docs/installation/installing-appdriver.md)
- [Guides](docs/installation)
  - [Writing Your First Test](docs/guides/writing-your-first-test.md)
  - [Finding Elements](docs/guides/finding-elements.md)
- [API Reference](./docs/api)
  - [Matchers](./docs/api/matchers.md)
  - [Element](./docs/api/element.md)
  - [Elements](./docs/api/elements.md)
  - [Device](./docs/api/device.md)
  - [Gestures](./docs/api/gestures.md)
  - [Expect](./docs/api/expect.md)
- [Change Log](./CHANGELOG.md)