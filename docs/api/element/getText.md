# `.getText() => String`

Retrieves text content of element.

#### Returns

`String`: Element text contents.

#### Examples

Text:
```jsx
// Application Code (React Native).
import { Text } from "react-native";

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
```javascript
(async () => {
  const text = await element(by.label("button")).getText();
  
  console.log(text); // "Press Me"
})();
```

Text Input:
```jsx
// Application Code (React Native).
import { Text } from "react-native";

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

- [`.getValue() => Any`](./getValue.md)
