const path = require("path");

const simulators = {
  iPhoneX: {
    bundleId: "org.reactjs.native.example.MyFirstTestingApp",
    app: path.join(__dirname, "app", "MyFirstTestingApp.zip"),
    platformName: "iOS",
    platformVersion: "13.3",
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
  devices: [
    { capabilities: simulators.iPhoneX }
  ]
};