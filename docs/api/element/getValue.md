# `.getValue(options?: Object) => Promise<Any>`

Retrieves value property of element.

#### Parameters

1. `options` (`Object?`):
  - `options.sliderRange` (`Tuple<Number, Number>?`): Provides cross-platform consistency when retrieving the value of a slider. The first number in the tuple is the minimum value, while the second number is the maximum value of the slider (e.g. `[0, 1]`).

#### Returns

`Promise` (`Any`): Element value property.

#### Examples

TODO: Examples here.

#### Related methods

- [`.getText() => Promise<String>`](./getText.md)

### Related Appium Docs

- [Get Element Text (Android)](http://appium.io/docs/en/commands/element/attributes/text/)
- [Get Element Value (iOS)](http://appium.io/docs/en/commands/element/attributes/value/)