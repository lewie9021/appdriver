# `.getText(options?: Object) => Promise<String>`

Retrieves text content of element.

#### Parameters

1. `options` (`Object?`):
    - `options.recursive` (`Boolean?`): Determines whether to recursively retrieve the inner text. Often useful on Android when text is fragmented, but can be used to retrieve text from grouping elements such as list items. Defaults to false.

#### Returns

`Promise` (`String`): Element text contents.

#### Examples

Text element:

```js
(async () => {
  const text = await element(by.label("text"))
    .getText();

  await expect(text).toEqual("Hello World!");
})();
```

Button (nested text):

```js
(async () => {
  const text = await element(by.label("button"))
    .getText({ recursive: true });

  await expect(text).toEqual("Press Me!");
})();
```

Text Input:

```js
(async () => {
  const text = await element(by.label("text-input"))
    .getText();

  await expect(text).toEqual("Hello World!");
})();
```

#### Related methods

- [`.getValue() => Promise<Any>`](./getValue.md)

### Related Appium Docs

- [Get Element Text](http://appium.io/docs/en/commands/element/attributes/text/)
