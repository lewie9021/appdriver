# `.getText(options?: Options) => Promise<String>`

Retrieves text content of element.

#### Parameters

1. `options` (`Object?`):
  - `options.recursive` (`Boolean?`): Determines whether to recursively retrieve the inner text. Often useful on Android when text is fragmented, but can be used to retrieve text from grouping elements such as list items.

#### Returns

`Promise` (`String`): Element text contents.

#### Examples

Text:
```jsx
// Application Code (React Native).
import { Text } from "react-native";
import { setTestId } from "appdriver";

const App = () => (
  <Text {...setTestId("text")}>
    E2E Testing with AppDriver
  </Text>
);

// Test Script (Node.js).
const { element, by } = require("appdriver");

(async () => {
  const text = await element(by.label("text")).getText();

  await expect(text).toEqual("E2E Testing with AppDriver");
})();
```

Button:
```jsx
// Application Code (React Native).
import { TouchableOpacity, Text } from "react-native";
import { setTestId } from "appdriver";

const App = () => (
  <TouchableOpacity
    {...setTestId("button")}
    onPress={() => alert("Hello World!")}
  >
    <Text>Press Me!</Text>
  </TouchableOpacity>
);

// Test Script (Node.js)
(async () => {
  const text = await element(by.label("button")).getText();

  await expect(text).toEqual("Press Me!");
})();
```

Text Input:
```jsx
// Application Code (React Native).
import { TextInput } from "react-native";
import { setTestId } from "appdriver";

const App = () => (
  <TextInput
    {...setTestId("text-input")}
    value="Hello World!"
  />
);

// Test Script (Node.js).
(async () => {
  const text = await element(by.label("text-input")).getText();

  await expect(text).toEqual("Hello World!");
})();
```

#### Related methods

- [`.getValue(options?: Object) => Promise<Any>`](./getValue.md)

### Related Appium Docs

- [Get Element Text](http://appium.io/docs/en/commands/element/attributes/text/)