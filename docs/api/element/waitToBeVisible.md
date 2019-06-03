# `.waitToBeVisible(options?: Object) => Element`

A handy `.waitFor` preset method for cases when elements may not be visible until some time in the future.

#### Parameters

1. `options` (Object?):
  - `options.interval` (Number?): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (Number?): Max duration in milliseconds to poll for before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

Screen Loading:

```jsx
// Application Code (React Native).
import { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { setTestId } from "appdriver";

const App = () => {
  const [ showButton, setShowButton ] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowButton(true), 2000);
  }, []);

  return (
    <View>
      {showButton
        ? (
          <Button
            {...setTestId("button")}
            title="Press me"
            onPress={() => alert("Hello World!")}
          />
        )
        : null
      }
    </View>
  );
};

// Test Script (Node.js).
const { element, by } = require("appdriver");

(async () => {
  const $button = await element(by.label("button"))
    .waitToBeVisible()
    .tap();
})();
```

TODO: More examples here.

#### Related methods

- [`.waitFor(fn: Function<Promise>, options?: Object) => Element`](./waitFor.md)
- [`.waitToExist(options?: Object) => Element`](./waitToExist.md)
- [`.waitToBeInvisible(options?: Object) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?: Object) => Element`](./waitToNotExist.md)
