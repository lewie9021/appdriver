# Configuration

Description: TODO.

### Options

- `appium` (`Object?`):
  - `baseUrl` (`String?`): Base URL of Appium server. Defaults to "http://localhost:4723/wd/hub".
  - `username` (`String?`): Username for server authentication - useful when connecting to SauceLabs and BrowserStack.
  - `password` (`String?`): Password for server authentication - useful when connecting to SauceLabs and BrowserStack.
- `ui` (`String?`): Interface to use when writing tests (e.g. `describe` and `it`). Defaults to "bdd". 
- `specs` (`Array<String>`): List of spec file paths.
- `reporters` (`Array<Function>?`): List of reporters to provide insight throughout your test run. Defaults to the [Basic](#basic) reporter. 
- `services` (`Array<Function>?`): List of services to provide functionality.
- `maxDevices` (`Number?`): Maximum number of `devices` to run in parallel. Defaults to 1 (series).
- `devices` (`Array<Object>`):
  - `specs` (`Array<String>?`): List of spec file paths. This will be in addition to the top-level `specs`.
  - `waitForInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. This will override the top-level `waitForInterval`.
  - `waitForTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. This will override the top-level `waitForTimeout`.
  - `testTimeout` (`Number?`): Maximum duration in milliseconds to wait for a test to complete. This will override the top-level `maxTestTimeout`.
  - `maxRetries` (`Number?`): Maximum number of retries for failing tests. This will override the top-level `testTimeout`.
  - `build` (`String?`): Build command to execute before running. Useful in local development and have access to the app source code.
  - `capabilities` (`Object`): Capabilities to send to the Appium server. Note: capabilities outside of `desired` are considered required.
    - `desired` (`Object?`): Desired capabilities for the Appium server to try and meet, but aren't required.
- `waitForInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. Defaults to 200.
- `waitForTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. Defaults to 10000.
- `testTimeout` (`Number?`): Maximum duration in milliseconds before timing out for a test to complete. Defaults to 60000.
- `maxRetries` (`Number?`): Maximum number of retries for failing tests. Defaults to 3.

### Examples
 
Automate an iPhone X 12.4 simulator for a single spec file.

```javascript
module.exports = {
  specs: [
    "./tests/hello-world.e2e.js"
  ],
  devices: [{
    capabilities: {
      automationName: "XCUITest",
      platformName: "iOS",
      platformVersion: "12.4",
      deviceName: "iPhone X",
      app: "<path to app>"
    } 
  }]
}
```

Ideally automate an iPhone X 12.4 simulator, but let the Appium server pick another iOS 12.4 device if an iPhone X isn't available.

```javascript
module.exports = {
  specs: [
    "./tests/hello-world.e2e.js"
  ],
  devices: [{
    capabilities: {
      desired: {
        deviceName: "iPhone X"
      },
      automationName: "XCUITest",
      platformName: "iOS",
      platformVersion: "12.4",
      app: "<path to app>"
    } 
  }]
}
```

### Reporters

Description: TODO.

#### Basic

Description: TODO.

### Services

Description: TODO.

#### Appium Local

Description: TODO.