# `.waitFor(condition: Function<Promise>, options?: Object) => Element`

Polls `condition` every `options.interval` until it resolves or `options.maxDuration` timeout is exceeded.

This is useful when your tests need to wait until a particular condition is met. It's common to make use of `expect` as part of defining the `condition` function.

#### Parameters

1. `condition` (`Function`):
    - `element` (`Element`): Reference to current element to apply assertions against.
    - `[ReturnType]` (`Promise`): Returning a Promise that rejects will trigger a retry until successfully resolving or exceeding `options.maxDuration`.
2. `options` (`Object?`):
    - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to 200.
    - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

[`.waitToBeInvisible`](./waitToBeInvisible.md) re-implementation:

```javascript
const { element, by, expect } = require("appdriver");

(async () => {
  element(by.label("button"))
    .waitFor(($e) => expect($e).not.toBeVisible());
})();
```

[`.waitToExist`](./waitToExist.md) re-implementation:

```javascript
const { element, by, expect } = require("appdriver");

(async () => {
  element(by.label("button"))
    .waitFor(($e) => expect($e).toExist());
})();
```

Countdown timer:

```javascript
const { element, by, expect } = require("appdriver");

(async () => {
  element(by.label("timer"))
    .waitFor(($e) => expect($e).toHaveText("0"));
})();
```

#### Related methods

- [`.waitToBeVisible(options?: Object) => Element`](./waitToBeVisible.md)
- [`.waitToExist(options?: Object) => Element`](./waitToExist.md)
- [`.waitToBeInvisible(options?: Object) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?: Object) => Element`](./waitToNotExist.md)
