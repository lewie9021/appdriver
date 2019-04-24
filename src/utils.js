const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getScreenshotSize = (base64Image) => {
  const buffer = Buffer.from(base64Image, "base64");

  if (buffer.toString('ascii', 12, 16) === 'CgBI') {
    return {
      'width': buffer.readUInt32BE(32),
      'height': buffer.readUInt32BE(36)
    };
  }
  return {
    'width': buffer.readUInt32BE(16),
    'height': buffer.readUInt32BE(20)
  };
};

// https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
const getIPhoneScaleFactor = (deviceName) => {
  switch (deviceName) {
    case "iPhone X": return 3;
    default: return 2;
  }
};

module.exports = {
  delay,
  getScreenshotSize,
  getIPhoneScaleFactor
};