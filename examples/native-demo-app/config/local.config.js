const path = require("path");
const getAppPath = require("./getAppPath");

const development = true;

const simulators = {
  iPhone8: {
    bundleId: "org.reactjs.native.example.NativeDemoApp",
    app: getAppPath("iOS", development),
    platformName: "iOS",
    platformVersion: "12.4",
    deviceName: "iPhone 8",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: true,
    noReset: true
  },
  iPhoneX: {
    bundleId: "org.reactjs.native.example.NativeDemoApp",
    app: getAppPath("iOS", development),
    platformName: "iOS",
    platformVersion: "12.4",
    deviceName: "iPhone X",
    automationName: "XCUITest",
    wdaLocalPort: 8101,
    waitForQuiescence: true,
    noReset: true
  }
};

const emulators = {
  pixel2: {
    appPackage: "com.nativedemoapp",
    app: getAppPath("Android", development),
    platformName: "Android",
    platformVersion: "8.1",
    deviceName: "Pixel_2_API_27",
    avd: "Pixel_2_API_27",
    automationName: "UiAutomator2",
    appActivity: "com.nativedemoapp.MainActivity",
    systemPort: 8200,
    noReset: true,
    chromedriverExecutableDir: path.join(__dirname, "chromedriver")
  }
};

module.exports = {
  maxDevices: 2,
  specs: [
    "../tests/button-screen.e2e.js",
    "../tests/carousel-screen.e2e.js",
    "../tests/form-screen.e2e.js",
    "../tests/swipeable-screen.e2e.js"
  ],
  devices: [
    { capabilities: simulators.iPhone8 },
    { capabilities: simulators.iPhoneX },
    { capabilities: emulators.pixel2 }
  ]
};