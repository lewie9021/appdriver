const getAppPath = require("./getAppPath");

const development = false;

const simulators = {
  iPhoneX: {
    app: getAppPath("iOS", development),
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
    app: getAppPath("Android", development),
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
    // "../tests/button-screen.e2e.js"
    // "../tests/carousel-screen.e2e.js"
    "../tests/form-screen.e2e.js"
  ],
  capabilities: [
    simulators.iPhoneX,
    // emulators.pixel2
  ]
};