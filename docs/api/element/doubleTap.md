# `.doubleTap(options?: Object) => Element`

Performs double tap gesture on element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): x offset from left of element. Defaults to center point.
  - `options.y` (`Number?`): y offset from top of element. Defaults to center point.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Perform double tap gesture at element center point:

```javascript
(async () => {
  await element(by.label("button"))
    .doubleTap();
})();
```

Perform double tap gesture at (200, 0), relative to the element location:

```javascript
(async () => {
  await element(by.label("button"))
    .doubleTap({ x: 200 });
})();
```

#### Related methods

- [`.tap(options?: Object) => Element`](./tap.md)
- [`.longPress(options?: Object) => Element`](./longPress.md)

### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)