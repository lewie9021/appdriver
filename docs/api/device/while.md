# `.while(condition: Function<Promise>, action: Function<Promise>, options?: Object) => Promise`

Polls `condition` and `action` every `options.interval` until `condition` rejects or `options.maxDuration` timeout is exceeded.

#### Parameters

1. `condition` (`Function`):
  - `[ReturnType]` (`Promise`): Returning a Promise that resolves will trigger a retry until it rejects or exceeds `options.maxDuration`.
2. `action` (`Function`):
  - `[ReturnType]` (`Promise`): A Promise that attempts to make `condition` reject.
3. `options` (`Object?`):
  - `options.interval` (`Number?`): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (`Number?`): Max duration in milliseconds to poll before throwing. Defaults to 10000.

#### Returns

`Promise`: A promise that resolves once `condition` rejects.

#### Examples

Swipe up until the button is visible.

```javascript
(async () => {
  await device.while(
    () => element(by.label("button").not.toBeVisible()),
    () => element(by.label("scroll-view").swipeUp({ distance: 100 }))
  );
})();
```

#### Related methods

- [`.wait(duration: Number) => Promise`](./wait.md)
- [`.waitFor(condition: Function<Promise>, options?: Object) => Promise`](./waitFor.md)