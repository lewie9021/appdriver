const path = require("path");

// Used to easily switch between 'release' and 'development' app.
const getAppPath = (platformName, dev = false) => {
  switch (platformName) {
    case "iOS":
      return dev
        ? path.join(__dirname, "..", "..", "..", "..", "appdriver-native-demo-app", "ios", "build", "NativeDemoApp", "Build", "Products", "Debug-iphonesimulator", "NativeDemoApp.app")
        : path.join(__dirname, "app", "NativeDemoApp.zip");
    case "Android":
      return dev
        ? path.join(__dirname, "..", "..", "..", "..", "appdriver-native-demo-app", "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk")
        : path.join(__dirname, "app", "native-app-demo.apk"); // TODO.
    default:
      return null;
  }
};

module.exports = getAppPath;