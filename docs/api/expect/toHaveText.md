# `.toHaveText(text: String | Regex, options?: Object) => Promise`

Asserts elements and alerts have text matching `text`.

#### Parameters

1. `text` (`String`): Text to compare against.
2. `options` (`Object`): Options required for [`.getText`](../element/getText.md) when asserting an element.

#### Returns

`Promise`: A promise that resolves if the assertion is successful.

#### Examples

Element text:

```javascript
(async () => {
  const $text = await element(by.label("text"))

  await expect($text).toHaveText("Hello World!");
})();
```

Input text:

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

Alert:

```javascript
(async () => {
  await expect(alert).toHaveText([
    "Alert",
    "Hello World!"
  ].join("\n"));
})();
```

#### Related methods

- [`.toHaveValue(value: Any, options?: Object) => Promise`](./toHaveValue.md)

#### Related Docs

- [Get Element Text](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Alert Text (W3C)](https://www.w3.org/TR/webdriver/#get-alert-text)
