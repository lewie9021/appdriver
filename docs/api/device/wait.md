# `.wait(duration: Number) => Promise`

Explicitly waits the given duration before continuing the test script.

#### Parameters

1. `duration` (Number): Time in milliseconds to wait.

#### Returns

`Promise`: A promise that resolves after the given duration.

#### Examples

Explicitly wait 200 milliseconds:

```javascript
(async () => {
  await device.wait(200);
})();
```
