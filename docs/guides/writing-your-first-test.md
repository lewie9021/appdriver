# Writing Your First Test

Let's create a test script that taps a button and asserts that a message appears with the text "Hello World!":

**tests/hello-world.e2e.js**
```javascript
const { element, by, expect } = require("appdriver");

describe("Native Demo App", () => {
  it("displays 'Hello World!' when the button is tapped", async () => {
    await element(by.label("button")).tap();
    
    const $alert = await element(by.label("alert")).waitToBeVisible();
    
    await expect($alert).toHaveText("Hello World!");
  });
});
```

Before we can run our test script, we must first define our AppDriver configuration file:

> Note: Configuration of AppDriver is currently very basic.
> - 'specs' only supports paths directly to files (no fuzzy matching).
> - 'capabilities' only accepts a single capability. 

**config/local.config.js**
```javascript
const simulators = {
  iPhoneX: {
    app: "<path to .app file>",
    platformName: "iOS",
    platformVersion: "12.1",
    deviceName: "iPhone X",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: false,
    noReset: true
  }
};

module.exports = {
  specs: [
    "../tests/hello-world.e2e.js"
  ],
  capabilities: [
    simulators.iPhoneX
  ]
};
```

Now that we have configured AppDriver, it is time to run test script:

```bash
./node_modules/.bin/appdriver --config ./config/local.config.js
```

Should you wish to alias the command above, simply modify your package.json file with a script command:

```json5
{
  // ...
  "scripts": {
      // ...
      "test:e2e": "appdriver --config ./config/local.config.js"
  }
  // ...
}
```