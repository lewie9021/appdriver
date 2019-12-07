# `.takeScreenshot(options: Object) => Promise<Buffer>`

Takes a screenshot (PNG) of the entire screen and saves the result on disk at the given `filePath` location.

#### Parameters

1. `options` (`Object`):
  - `options.filePath` (`String?`): Absolute path on disk to store the screenshot. 

#### Returns

`Promise<Buffer>`: A promise containing a base64 buffer that resolves after the screenshot has been taken and successfully stored on disk.

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

### Related Appium Docs

- [Take Screenshot](http://appium.io/docs/en/commands/session/screenshot/)