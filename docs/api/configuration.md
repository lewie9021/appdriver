# Configuration

Description: TODO.

### Options

- `appium` (`Object?`):
  - `baseUrl` (`String?`): Base URL of Appium server. Defaults to "http://localhost:4723/wd/hub".
  - `username` (`String?`): Username for server authentication - useful when connecting to cloud services such as SauceLabs or BrowserStack.
  - `password` (`String?`): Password for server authentication - useful when connecting to cloud services such as SauceLabs or BrowserStack.
- `ui` (`String?`): Interface to use when writing tests (e.g. `describe` and `it`). Defaults to "bdd". See [Mocha Interfaces](https://mochajs.org/#interfaces) for other options.
- `specs` (`Array<String>`): List of spec file paths (Glob pattern matching not yet supported).
- `reporters` (`Array<Function>?`): List of reporters to provide insight throughout your test run. Defaults to the [Basic](#basic) reporter. 
- `plugins` (`Array<Function>?`): List of plugins to provide functionality throughout your test run.
- `maxDevices` (`Number?`): Maximum number of `devices` to run in parallel. Defaults to 1 (series).
- `devices` (`Array<Object>`):
  - `specs` (`Array<String>?`): List of spec file paths. This will be in addition to the top-level `specs`.
  - `waitForInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. This will override the top-level `waitForInterval`.
  - `waitForTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. This will override the top-level `waitForTimeout`.
  - `testTimeout` (`Number?`): Maximum duration in milliseconds to wait for a test to complete. This will override the top-level `testTimeout`.
  - `maxTestRetries` (`Number?`): Maximum number of retries for failing tests. This will override the top-level `maxTestRetries`.
  - `build` (`String?`): Build command to execute before running. Useful in local development and have access to the app source code.
  - `capabilities` (`Object`): Capabilities to send to the Appium server.
- `waitForInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. Defaults to 200.
- `waitForTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. Defaults to 10000.
- `testTimeout` (`Number?`): Maximum duration in milliseconds before timing out for a test to complete. Defaults to 60000.
- `maxTestRetries` (`Number?`): Maximum number of retries for failing tests. Defaults to 3.

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

### Reporters

Description: TODO.

#### Basic

Description: TODO.

### Plugins

Description: TODO.

#### Appium Local

Description: TODO.
