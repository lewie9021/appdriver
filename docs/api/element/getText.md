# `.getText() => Promise<String>`

Retrieves text content of element.

#### Returns

`Promise` (String): Element text contents.

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
  
  console.log(text); // "E2E Testing with AppDriver"
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
  
  console.log(text); // "Press Me"
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
  
  console.log(text); // "Hello World!"
})();
```

#### Related methods

- [`.getValue() => Promise<Any>`](./getValue.md)
