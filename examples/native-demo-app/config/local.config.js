const path = require("path");

const simulators = {
  iPhoneX: {
    app: path.join(__dirname, "app", "NativeDemoApp.zip"),
    platformName: "iOS",
    platformVersion: "12.1",
    deviceName: "iPhone X",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: false,
    noReset: true
  }
};

const emulators = {
  pixel2: {
    app: path.join(__dirname, "app", "native-app-demo.apk"), // TODO.
    platformName: "Android",
    platformVersion: "8.1",
    deviceName: "Pixel_2_API_27",
    avd: "Pixel_2_API_27",
    automationName: "UiAutomator2",
    appActivity: "com.nativedemoapp.MainActivity",
    systemPort: 8200,
    noReset: true
  }
};

module.exports = {
  specs: [
    "../tests/form-screen.e2e.js"
  ],
  capabilities: [
    simulators.iPhoneX
  ]
};