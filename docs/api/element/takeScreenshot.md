# `.takeScreenshot(options: Object) => Promise<Buffer>`

Takes a screenshot (PNG) of the element within the viewport and saves the result on disk at the given `filePath` location.

#### Parameters

1. `options` (`Object`):
    - `options.filePath` (`String?`): Absolute path on disk to store the screenshot. 

#### Returns

`Promise<Buffer>`: A promise containing a base64 buffer that resolves after the screenshot has been taken and successfully stored on disk.

#### Examples

Take a screenshot of the element and save in a relative 'screenshots' directory.

```javascript
const path = require("path");

(async () => {
  const filePath = path.join(__dirname, "screenshots", "screenshot.png");
  await element(by.label("list-item")).takeScreenshot({ filePath });
})();
```     

### Related Docs

- [Take Element Screenshot (W3C)](https://www.w3.org/TR/webdriver/#dfn-take-element-screenshot)