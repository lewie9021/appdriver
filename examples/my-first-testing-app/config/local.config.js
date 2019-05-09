const path = require("path");

const simulators = {
  iPhoneX: {
    app: path.join(__dirname, "app", "MyFirstTestingApp.zip"),
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