# `.tap(options?: Object) => Element`

Performs tap gesture on element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): x offset from left of element. Defaults to 0.
  - `options.y` (`Number?`): y offset from top of element. Defaults to 0.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Perform simple tap gesture at coordinate (0, 0), relative to the element location:

```javascript
(async () => {
  await element(by.label("button"))
    .tap();
})();
```

Perform tap gesture at the center point (width / 2, height / 2), relative to the element location:

```javascript
(async () => {
  const $button = await element(by.label("button"));
  const { width, height } = await $button.getSize();

  await $button.tap({ x: width / 2, y: height / 2 });
})();
```

#### Related methods

- [`.longPress(options?: Object) => Element`](./longPress.md)

### Related Appium Docs

- [W3C Actions](http://appium.io/docs/en/commands/interactions/actions/)