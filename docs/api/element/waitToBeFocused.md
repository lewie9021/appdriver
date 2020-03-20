# `.waitToBeFocused(options?: Object) => Element`

Polls for element to be focused every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

#### Parameters

1. `options` (`Object?`):
    - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to 200.
    - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll for before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

```javascript
(async () => {
  await element(by.label("text-input"))
    .waitToBeFocused();
})();
```

#### Related methods

- [`.waitFor(fn: Function<Promise>, options?: Object) => Element`](./waitFor.md)
- [`.waitToExist(options?: Object) => Element`](./waitToExist.md)
- [`.waitToBeVisible(options?: Object) => Element`](./waitToBeVisible.md)
- [`.waitToBeInvisible(options?: Object) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?: Object) => Element`](./waitToNotExist.md)

### Related Appium Docs

- [Get Active Element (iOS)](http://appium.io/docs/en/commands/element/other/active/)
- [Get Element Attribute (Android)](http://appium.io/docs/en/commands/element/attributes/attribute/)