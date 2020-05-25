const { sessionStore } = require("../stores/sessionStore");
const { isPlatform } = require("../../utils");

// iOS already uses Density-Independent Pixels. This method applies the conversion for Android.
const normalisePixels = (pixels) => {
  if (isPlatform("Android")) {
    return sessionStore.getCapabilities("pixelRatio") * pixels;
  }

  return pixels;
};

module.exports = {
  normalisePixels
};