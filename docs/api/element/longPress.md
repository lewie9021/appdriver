# `.longPress(options?: Object) => Element`

Performs long press gesture on the element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): x offset from left of element. Defaults to center point.
  - `options.y` (`Number?`): y offset from top of element. Defaults to center point.
  - `options.duration` (`Number?`): Time in milliseconds to perform the press gesture. Defaults to 750.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Perform long press gesture at element center point:

```javascript
(async () => {
  await element(by.label("button"))
    .longPress();
})();
```

Perform long press gesture at (100, 25), relative to the element location:

```javascript
(async () => {
  await element(by.label("button"))
    .longPress({ x: 100, y: 25 });
})();
```

#### Related methods

- [`.tap(options?: Object) => Element`](./tap.md)
- [`.doubleTap(options?: Object) => Element`](./doubleTap.md)

### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)