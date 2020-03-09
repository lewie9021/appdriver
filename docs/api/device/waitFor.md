# `.waitFor(condition: Function<Promise>, options?: Object) => Promise`

Polls `condition` every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

This is useful when your tests need to wait until a particular condition is met. It's common to make use of `expect` as part of defining the `condition` function.

#### Parameters

1. `condition` (`Function`):
  - `[ReturnType]` (`Promise`): Returning a Promise that rejects will trigger a retry until successfully resolving or exceeding `options.maxDuration`.
2. `options` (`Object?`):
  - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll before throwing. Defaults to 10000.

#### Returns

`Promise`: A promise that resolves if `condition` resolves.

#### Examples

Countdown timer:

```javascript
const { device, element, by, expect } = require("appdriver");

(async () => {
  await device.waitFor(() => {
    return expect(element(by.label("timer-text"))).toHaveText("0");
  });
})();
```

#### Related methods

- [`.wait(duration: Number) => Promise`](./wait.md)