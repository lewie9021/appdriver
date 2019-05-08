# AppDriver

A mobile focused, intuitive Appium client.

### Notice

**This project is currently in the Alpha stage**, meaning the API is subject to change and may be missing functionality detailed in the documentation. If you're interested in the project's roadmap, feel free to take a look at the [Beta release project board](https://github.com/lewie9021/appdriver/projects/2).

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
