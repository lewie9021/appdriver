# Config

Description: TODO.

### Options

- `appium` (`Object?`):
  - `baseUrl` (`String?`): Base URL of appium server. Defaults to "http://localhost:444/wd/hub".
  - `username` (`String?`): Username for server authentication - useful when connecting to SauceLabs and BrowserStack.
  - `password` (`String?`): Password for server authentication - useful when connecting to SauceLabs and BrowserStack.
- `ui` (`String?`): Interface to use when writing tests (e.g. `describe` and `it`). Defaults to "bdd". 
- `specs` (`Array<String>`): List of spec file paths.
- `reporters` (`Array<string | Function>?`): List of reporters to provide insight throughout your test run. Defaults to ["basic"]. 
- `services` (`Array<string | Function>?`): List of services to provide functionality.
- `maxDevices` (`Number?`): Maximum number of `devices` to run in parallel. Defaults to 1 (series).
- `devices` (`Array<Object>`):
  - `specs` (`Array<String>?`): List of spec file paths for the given device. This will override the top-level `specs`.
  - `reporters` (`Array<string | Function>?`): List of reporters to provide insight throughout your test run. This will override the top-level `reporters`.
  - `services` (`Array<string | Function>?`): List of services to provide functionality. This will override the top-level `services`.
  - `waitForTimeout` (`Number?`): Maximum duration in milliseconds to wait when using waits within tests. This will override the top-level `waitForTimeout`.
  - `testTimeout` (`Number?`): Maximum duration in milliseconds to wait for a test to complete. This will override the top-level `maxTestTimeout`.
  - `maxRetries` (`Number?`): Maximum number of retries for failing tests. This will override the top-level `testTimeout`.
  - `capabilities` (`Object`): Capabilities to send to the Appium server. Note: capabilities outside of `desired` are considered required.
    - `desired` (`Object?`): Desired capabilities for the Appium server to try and meet, but aren't required.
- `waitForTimeout` (`Number?`): Maximum duration in milliseconds to wait when using waits within tests. Defaults to 10000.
- `testTimeout` (`Number?`): Maximum duration in milliseconds to wait for a test to complete. Defaults to 60000.
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
      app: "<path to app>",
      deviceName: "iPhone X",
      platformVersion: "12.4"
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
      app: "<path to app>",
      platformVersion: "12.4"
    } 
  }]
}
```

### Reporters

Description: TODO.

#### Basic

Description: TODO.