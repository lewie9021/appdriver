# AppDriver

A mobile focused, intuitive Appium client.

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
- [Guides](./docs/guides)
  - [Installation](./docs/guides/installation.md)
  - [Finding Elements](./docs/guides/finding-elements.md)
- [API Reference](./docs/api)
  - [Device](./docs/api/device.md)
  - [Matchers](./docs/api/matchers.md)
  - [Element](./docs/api/element.md)
  - [Elements](./docs/api/elements.md)
  - [Gestures](./docs/api/gestures.md)
  - [Expect](./docs/api/expect.md)

### TODOs

- [ ] Support for parallel testing.
- [ ] Support for multiple capabilities.
- [ ] Host documentation on github.io.