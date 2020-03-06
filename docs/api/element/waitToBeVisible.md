# `.waitToBeVisible(options?: Object) => Element`

A handy `.waitFor` preset method for cases when elements may not be visible until some time in the future.

#### Parameters

1. `options` (`Object?`):
  - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll for before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

```javascript
const { element, by } = require("appdriver");

(async () => {
  element(by.label("button"))
    .waitToBeVisible();
})();
```

#### Related methods

- [`.waitFor(fn: Function<Promise>, options?: Object) => Element`](./waitFor.md)
- [`.waitToExist(options?: Object) => Element`](./waitToExist.md)
- [`.waitToBeInvisible(options?: Object) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?: Object) => Element`](./waitToNotExist.md)
- [`.waitToBeFocused(options?: Object) => Element`](./waitToBeFocused.md)

### Related Appium Docs

- [Is Element Displayed](http://appium.io/docs/en/commands/element/attributes/displayed/)