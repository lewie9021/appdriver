# AppDriverIO

A mobile focused, intuitive Appium WebDriver client.

### API

#### Element

Example 2 (Selection + Action):
```javascript
(async () => {
  const $element = await element(by.id("my-element-by-testId"));
  
  await $element.longPress();
})();
```

Example 3 (Selection + Action):
```javascript
(async () => {
  await element(by.id("my-element-by-testId"))
    .tap()
})();
```

Example 4 (Selection + Action):
```javascript
(async () => {
  // Set input text.
  const $element = await element(by.id("my-input-by-testId"))
    .value("hello");
})();
```

Example 5 (Selection + Action):
```javascript
(async () => {
  // Get text from input.
  const inputText = await element(by.id("my-input-by-testId"))
    .value();
})();
```

Example 6 (Selection + Action):
```javascript
(async () => {
  const inputText = await element(by.id("my-input-by-testId"))
    .value("hello", {speed: 0.3});
})();
```