# Matchers

TODO

### Examples
 
Find element with an ID of "input": 

```javascript
 (async () => {
   const $input = await element(by.id("input"));
 })();
```

Find all elements that have an accessibility label starting with "list-item-".

```javascript
 (async () => {
   const $listItems = await elements(by.label("list-item-*"));
 })();
```

Find all elements that have an accessibility label containing "item".

```javascript
 (async () => {
   const $listItems = await elements(by.label("*item*"));
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

:hammer: [```by.id(id: String) => Matcher```](./matchers/id.md)

Find element(s) by their ID. For Android this is the `resource-id` attribute, whereas for iOS it's the `name` attribute.

:white_check_mark: [```by.label(accessibilityLabel: String) => Matcher```](./matchers/label.md)

Find element(s) by their accessibility label. For Android this is the `content-desc` attribute, whereas for iOS it's the `accessibility-id` attribute.

:warning: [```by.text(text: String) => Matcher```](./matchers/text.md)

TODO: Description here.
