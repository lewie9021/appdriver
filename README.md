# [AppDriver](https://lewie9021.github.io/appdriver/)

[![NPM Version](https://img.shields.io/npm/v/appdriver.svg?style=flat)](https://www.npmjs.com/package/appdriver) [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lewie9021/appdriver/blob/master/LICENSE.md)

A mobile focused test automation framework.

[Get Started](https://lewie9021.github.io/appdriver/docs/getting-started.html) | [API Reference](https://lewie9021.github.io/appdriver/docs/api-reference) | [Native Demo App](https://github.com/lewie9021/appdriver-native-demo-app) | [Change Log](https://github.com/lewie9021/appdriver/blob/master/CHANGELOG.md)

<img width="100%" src="https://raw.githubusercontent.com/lewie9021/appdriver/master/assets/demo.gif">

### Notices

**This project is currently in the Beta stages of development**, meaning the framework is capable of handling general use cases but may be lacking some functionality, documentation and stability. If you're interested in the project's roadmap, feel free to check out the [Projects tab](https://github.com/lewie9021/appdriver/projects).

### Goal

The goal of this project is to offer a mobile focused E2E testing framework that's "batteries included". It should provide a familiar interface for running tests, an assertion library orientated around E2E testing, and first class support for common operations.

### Motivation

After using [WebdriverIO](https://github.com/webdriverio/webdriverio) for over a year on a real world project, I found it frustrating to perform even basic tasks without spending hours writing helper function(s) or helplessly trying to figure out how to use the framework in the context of Appium.

The major Webdriver clients focus too heavily on the Web, giving the impression that mobile (via Appium) is an afterthought. I was frequently forced down a trial and error path as the documentation was either sparse or simply non-existent.

Initially, I started this project as a proof of concept, taking inspiration from [Detox](https://github.com/wix/Detox), [WebdriverIO](https://github.com/webdriverio/webdriverio), [WD.js](https://github.com/admc/wd), and [Jest](https://github.com/facebook/jest). I really liked the syntactic style of [Detox](https://github.com/wix/Detox) and wanted to see how it might look when paired with the ([Mobile](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md)) [JSON Wire Protocol](https://w3c.github.io/webdriver/).

Unlike Webdriver clients, [Detox](https://github.com/wix/Detox) is yet to support testing in the cloud and on [real iOS devices](https://github.com/wix/detox/issues/95). For me, this was a limitation I simply couldn't ignore. I feel it's critical in ensuring tests run quickly and provide the confidence that the application works as expected on a variety of real devices.

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
    .swipeLeft({ percentage: 0.75 });
  
  await expect(element(by.label("carousel-page-2"))).toBeVisible();
})();
```

##### Regex element matching

```javascript
(async () => {
  const $items = await elements(by.label(/list-item-.*/));
  
  await expect($items).toHaveLength(3);
})();
```

##### Custom gestures

```javascript
(async () => {
  const $box = await element(by.label("box"));
  const { x, y } = await $box.getLocation({ relative: true });
 
  const tap = gestures.series([
    gestures.moveTo({ x, y }),
    gestures.press(),
    gestures.wait(100),
    gestures.release()
  ]);
  
  await device.performGesture(tap);
})();
```