const iPhoneX = {
  "app": "../appdriver-native-demo-app/ios/build/NativeDemoApp/Build/Products/Debug-iphonesimulator/NativeDemoApp.app",
  "platformName": "iOS",
  "platformVersion": "12.1",
  "deviceName": "iPhone X",
  "automationName": "XCUITest",
  "wdaLocalPort": 8100,
  "waitForQuiescence": false
};

const pixel2 = {
  "app": "../appdriver-native-demo-app/android/app/build/outputs/apk/debug/app-debug.apk",
  "platformName": "Android",
  "platformVersion": "8.1",
  "deviceName": "Pixel_2_API_27",
  "avd": "Pixel_2_API_27",
  "automationName": "UiAutomator2",
  "appActivity": "com.nativedemoapp.MainActivity",
  "systemPort": 8200
};

module.exports = {
  iPhoneX,
  pixel2
};