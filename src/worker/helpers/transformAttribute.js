const { platform, isPlatform, toValue, toBoolean, toNumber } = require("../../utils");

const transformBounds = (x) => {
  const coordinates = x.match(/(\d|\.)+/g);

  return {
    x1: parseFloat(coordinates[0]),
    y1: parseFloat(coordinates[1]),
    x2: parseFloat(coordinates[2]),
    y2: parseFloat(coordinates[3])
  };
};

const transformAttribute = (name, value) => {
  if (isPlatform("Web")) {
    return value;
  }

  // Known attributes.
  const transforms = platform.select({
    ios: () => ({
      "UID": toValue,
      "accessibilityContainer": toBoolean,
      "accessible": toBoolean,
      "enabled": toBoolean,
      "frame": toValue, // Get 500 error from Appium: "Invalid type in JSON write (NSConcreteValue)".
      "label": toValue,
      "name": toValue,
      "rect": JSON.parse,
      "selected": toBoolean,
      "type": toValue,
      "value": toValue, // null when input is empty otherwise a string.
      "visible": toBoolean,
      "wdAccessibilityContainer": toBoolean,
      "wdAccessible": toBoolean,
      "wdEnabled": toBoolean,
      "wdFrame": toValue,
      "wdLabel": toValue,
      "wdName": toValue,
      "wdRect": JSON.parse,
      "wdSelected": toBoolean,
      "wdType": toValue,
      "wdUID": toValue,
      "wdValue": toValue,
      "wdVisible": toBoolean
    }),
    android: () => ({
      "checkable": toBoolean,
      "checked": toBoolean,
      "class": toValue,
      "className": toValue,
      "clickable": toBoolean,
      "content-desc": toValue,
      "contentDescription": toValue,
      "enabled": toBoolean,
      "focusable": toBoolean,
      "focused": toBoolean,
      "long-clickable": toBoolean,
      "longClickable": toBoolean,
      "package": toValue,
      "password": toBoolean,
      "resource-id": toValue,
      "resourceId": toValue,
      "scrollable": toBoolean,
      "selection-start": toNumber,
      "selection-end": toNumber,
      "selected": toBoolean,
      "name": toValue,
      "text": toValue,
      "bounds": transformBounds,
      "displayed": toBoolean,
      "contentSize": JSON.parse // Only works on scroll views.
    })
  });

  const transform = transforms[name];

  if (transform) {
    return transform(value);
  }

  return value;
};

module.exports = transformAttribute;