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

### Matchers API

:hammer: [```by.id(id: string) => Matcher```](./matchers/id.md)

TODO: Description here.

:hammer: [```by.label(accessibilityLabel: string) => Matcher```](./matchers/label.md)

TODO: Description here.
