# `.takeScreenshot(options: Object) => Promise`

Takes a screenshot (PNG) of the entire screen and saves the result on disk at the given `filePath` location.

#### Parameters

1. `options` (`Object`):
  - `options.filePath` (`String?`): Absolute path on disk to store the screenshot. 

#### Returns

`Promise`: A promise that resolves after the screenshot has been taken and successfully stored on disk.

#### Examples

Take a screenshot and save in a relative 'screenshots' directory.

```javascript
const path = require("path");

(async () => {
  const filePath = path.join(__dirname, "screenshots", "screenshot.png");
  await device.takeScreenshot({ filePath });
})();
```

#### Related methods

- [`.startScreenRecording(options: Object) => Promise`](./startScreenRecording.md)
- [`.stopScreenRecording() => Promise`](./stopScreenRecording.md)
