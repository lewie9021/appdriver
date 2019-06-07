# `.longPress(options?: Object) => Element`

Performs long press gesture on element.

#### Parameters

1. `options` (`Object?`):
  - `options.x` (`Number?`): x offset from left of element. Defaults to 0.
  - `options.y` (`Number?`): y offset from top of element. Defaults to 0.
  - `options.duration` (`Number?`): Time in milliseconds to perform the press gesture. Defaults to 750.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Basic long press. This will perform a long press gesture at the coordinate (0, 0), relative to the element position in the viewport:

```javascript
(async () => {
  await element(by.label("button"))
    .longPress();
})();
```

Customised long press. This will first get the size of the button to calculate the center point and extend the duration of the press gesture to a second:

```javascript
(async () => {
  const $button = await element(by.label("button"));
  const { width, height} = await $button.getSize();

  await $button.longPress({
    x: width / 2,
    y: height / 2,
    duration: 
  });
})();
```

#### Related methods

- [`.tap(options?: Object) => Element`](./tap.md)
