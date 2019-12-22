# Matchers

Matchers define how elements are found. There are several ways of searching for elements in the tree such as `by.label` and `by.text`. What's important is that you use a strategy that is reliable in your application and won't change often.

### Examples
 
Find element with an accessibility label of "input": 

```javascript
 (async () => {
   const $input = await element(by.label("input"));
 })();
```

Find all elements that have an accessibility label starting with "list-item-".

```javascript
 (async () => {
   const $listItems = await elements(by.label(/^list-item-.*$/));
 })();
```

Find element with text 'Click Me!''.

```javascript
 (async () => {
   const $button = await element(by.text("Click Me!"));
   
   await $button.tap();
 })();
```

### Matchers API

[```by.id(id: String | Regex) => Matcher```](./matchers/byId.md)

<img src="https://img.shields.io/badge/Platforms-Both-blue.svg" />

Find element(s) by their ID. For Android this is the `resource-id` attribute, whereas for iOS it's the `name` attribute.

[```by.label(label: String | Regex) => Matcher```](./matchers/byLabel.md)

<img src="https://img.shields.io/badge/Platforms-Both-blue.svg" />

Find element(s) by their accessibility label. For Android this is the `content-desc` attribute, whereas for iOS it's the `name` attribute.

[```by.text(text: String | Regex) => Matcher```](./matchers/byText.md)

<img src="https://img.shields.io/badge/Platforms-Both-blue.svg" />

Find element(s) by their text value.

[```by.type(type: String) => Matcher```](./matchers/byType.md)

<img src="https://img.shields.io/badge/Platforms-Both-blue.svg" />

Find element(s) by their type.

[```by.iosPredicate(predicate: String) => Matcher```](./matchers/byIosPredicate.md)

<img src="https://img.shields.io/badge/Platforms-iOS-blue.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" />

Find element(s) using a iOS predicate selector.

[```by.uiAutomator(selector: String) => Matcher```](./matchers/ByUiAutomator.md)

<img src="https://img.shields.io/badge/Platforms-Android-blue.svg" /> <img src="https://img.shields.io/badge/Dev-TODO-red.svg" /> <img src="https://img.shields.io/badge/Docs-TODO-red.svg" /> <img src="https://img.shields.io/badge/Tests-TODO-red.svg" />

Find element(s) using a Ui Automator selector.