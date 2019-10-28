# `.getText() => Promise<String>`

Retrieves text content of element.

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