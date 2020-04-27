# Configuration

The configuration file provides a way of tweaking AppDriver the way you want. While it tries to provide sane defaults for most options, every project is different. At it's most basic, you will need to define a list of `specs` along with a list of `devices` to run.

### Options

- `appium` (`Object?`):
  - `baseUrl` (`String?`): Base URL of Appium server. Defaults to "http://localhost:4723/wd/hub".
- `ui` (`String?`): Interface to use when writing tests (e.g. `describe` and `it`). Defaults to "bdd". See [Mocha Interfaces](https://mochajs.org/#interfaces) for other options.
- `specs` (`Array<String>`): List of spec file paths (Glob pattern matching not yet supported).
- `reporters` (`Array<Function>?`): List of reporters to provide insight throughout your test run. Defaults to the [Basic](#basic) reporter. 
- `maxDevices` (`Number?`): Maximum number of `devices` to run in parallel. Defaults to 1 (series).
- `devices` (`Array<Object>`):
  - `specs` (`Array<String>?`): List of spec file paths. This will be in addition to the top-level `specs`.
  - `findInterval` (`Number?`): Interval duration in milliseconds to poll for elements within tests. This will override the top-level `findInterval`.
  - `findTimeout` (`Number?`): Maximum duration in milliseconds before timing out when finding elements within tests. This will override the top-level `findTimeout`.
  - `waitInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. This will override the top-level `waitInterval`.
  - `waitTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. This will override the top-level `waitTimeout`.
  - `testTimeout` (`Number?`): Maximum duration in milliseconds to wait for a test to complete. This will override the top-level `testTimeout`.
  - `maxSpecRetries` (`Number?`): Maximum number of retries for failing spec files. This will override the top-level `maxSpecRetries`.
  - `capabilities` (`Object`): Capabilities to send to the Appium server.
- `findInterval` (`Number?`): Interval duration in milliseconds to poll for elements within tests. Defaults to 200.
- `findTimeout` (`Number?`): Maximum duration in milliseconds before timing out when finding elements within tests. Defaults to 10000.
- `waitInterval` (`Number?`): Interval duration in milliseconds to poll the expectation when using waits within tests. Defaults to 200.
- `waitTimeout` (`Number?`): Maximum duration in milliseconds before timing out when using waits within tests. Defaults to 10000.
- `testTimeout` (`Number?`): Maximum duration in milliseconds before timing out for a test to complete. Defaults to 60000.
- `maxSpecRetries` (`Number?`): Maximum number of retries for failing spec files. Defaults to 2.

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

#### Basic

This is the default reporter that simply outputs the status and duration of each test.

<img width="100%" src="https://raw.githubusercontent.com/lewie9021/appdriver/master/docs/assets/basic-reporter.png">