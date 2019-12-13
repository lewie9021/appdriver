const { platform, isRegex } = require("../utils");
const getNativeRegex = require("./helpers/getNativeRegex");

const getByIdMatcher = (id) => ({
  using: "id",
  value: id
});

const getByAccessibilityLabelMatcher = (accessibilityLabel) => {
  if (isRegex(accessibilityLabel)) {
    const regex = getNativeRegex(accessibilityLabel);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `name MATCHES${regex.modifiers} '${regex.pattern}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().descriptionMatches("${regex.modifiers}${regex.pattern}")`
      })
    });
  }

  return {
    using: "accessibility id",
    value: accessibilityLabel
  };
};

const getByTextMatcher = (text) => {
  if (isRegex(text)) {
    const regex = getNativeRegex(text);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `label MATCHES${regex.modifiers} '${regex.pattern}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().textMatches("${regex.modifiers}${regex.pattern}")`
      })
    });
  }

  return platform.select({
    ios: () => ({
      using: "-ios predicate string",
      value: `label = '${text}'`
    }),
    android: () => ({
      using: "-android uiautomator",
      value: `new UiSelector().text("${text}")`
    })
  });
};

module.exports = {
  id: getByIdMatcher,
  label: getByAccessibilityLabelMatcher,
  text: getByTextMatcher
};