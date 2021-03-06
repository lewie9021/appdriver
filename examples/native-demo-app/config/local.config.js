const path = require("path");
const getAppPath = require("./getAppPath");

const development = true;

const simulators = {
  iPhoneSE: {
    bundleId: "com.nativedemoapp",
    app: getAppPath("iOS", development),
    derivedDataPath: path.join(__dirname, "derived-data", "iphone-se-13-3"),
    platformName: "iOS",
    platformVersion: "13.3",
    deviceName: "iPhone SE",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: true,
    noReset: true
  },
  iPhone8: {
    bundleId: "com.nativedemoapp",
    app: getAppPath("iOS", development),
    derivedDataPath: path.join(__dirname, "derived-data", "iphone-8-13-3"),
    platformName: "iOS",
    platformVersion: "13.3",
    deviceName: "iPhone 8",
    automationName: "XCUITest",
    wdaLocalPort: 8100,
    waitForQuiescence: true,
    noReset: true
  },
  iPhoneX: {
    bundleId: "com.nativedemoapp",
    app: getAppPath("iOS", development),
    derivedDataPath: path.join(__dirname, "derived-data", "iphone-x-13-3"),
    platformName: "iOS",
    platformVersion: "13.3",
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
    "../tests/alert-screen.e2e.js",
    "../tests/carousel-screen.e2e.js",
    "../tests/form-screen.e2e.js",
    "../tests/list-screen.e2e.js",
    "../tests/source.e2e.js",
    "../tests/swipeable-screen.e2e.js",
    "../tests/zoom-screen.e2e.js",
    "../tests/webview-screen.e2e.js",
    "../tests/deep-linking.e2e.js",
  ],
  devices: [
    {
      capabilities: simulators.iPhone8,
      specs: [
        "../tests/date-picker-screen.ios.e2e.js",
        "../tests/alert-screen.ios.e2e.js",
        "../tests/execute.ios.e2e.js",
      ]
    },
    {
      capabilities: simulators.iPhoneX,
      specs: [
        "../tests/date-picker-screen.ios.e2e.js",
        "../tests/alert-screen.ios.e2e.js",
        "../tests/execute.ios.e2e.js",
      ]
    },
    {
      capabilities: emulators.pixel2,
      specs: [
        // "../tests/date-picker-screen.android.e2e.js"
        "../tests/execute.android.e2e.js",
      ]
    }
  ]
};