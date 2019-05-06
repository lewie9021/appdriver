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

TODO: Description here.

:white_check_mark: [```by.label(accessibilityLabel: String) => Matcher```](./matchers/label.md)

TODO: Description here.

:warning: [```by.text(text: String) => Matcher```](./matchers/text.md)

TODO: Description here.