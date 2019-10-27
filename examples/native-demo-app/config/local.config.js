const getAppPath = require("./getAppPath");

const development = true;

const simulators = {
  iPhone8: {
    app: getAppPath("iOS", development),
    platformName: "iOS",
    platformVersion: "12.4",
    deviceName: "iPhone 8",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: false,
    noReset: true
  },
  iPhoneX: {
    app: getAppPath("iOS", development),
    platformName: "iOS",
    platformVersion: "12.4",
    deviceName: "iPhone X",
    automationName: "XCUITest",
    wdaLocalPort: 8101,
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
    // "../tests/swipeable-screen.e2e.js"
  ],
  capabilities: [
    // simulators.iPhone8,
    simulators.iPhoneX,
    // emulators.pixel2
  ]
};