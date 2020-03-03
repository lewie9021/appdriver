# `.toHaveText(text: String | Regex, options?: Object) => Promise`

Asserts the element has text matching `text`.

#### Parameters

1. `text` (`String`): Text to compare against the element's text.
2. `options` (`Object`): Options required for [`.getText`](../element/getText.md).

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Text:

```javascript
(async () => {
  const $text = await element(by.label("text"))

  await expect($text).toHaveText("Hello World!");
})();
```

Text input:

```javascript
(async () => {
  const $input = await element(by.label("text-input"))

  await expect($input).toHaveText("Hello World!");
})();
```

Button (nested text):

```javascript
(async () => {
  const $button = await element(by.label("button"))

  await expect($button).toHaveText("Press Me!", { recursive: true });
})();
```

#### Related methods

- [`.toHaveValue(value: Any, options?: Object) => Promise`](./toHaveValue.md)

### Related Appium Docs

- [Get Element Text](http://appium.io/docs/en/commands/element/attributes/text/)
