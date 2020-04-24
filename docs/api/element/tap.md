# `.tap(options?: Object) => Element`

Performs tap gesture on element.

#### Parameters

1. `options` (`Object?`):
    - `options.x` (`Number?`): x offset from left of element. Defaults to center point.
    - `options.y` (`Number?`): y offset from top of element. Defaults to center point.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Perform tap gesture at element center point:

```javascript
(async () => {
  await element(by.label("button"))
    .tap();
})();
```

Perform tap gesture at (0, 50), relative to the element location:

```javascript
(async () => {
  await element(by.label("button"))
    .tap({ y: 50 });
})();
```

#### Related methods

- [`.doubleTap(options?: Object) => Element`](./doubleTap.md)
- [`.longPress(options?: Object) => Element`](./longPress.md)

#### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)