const { platform, isPlatform, isRegex } = require("../utils");
const { NotImplementedError } = require("./errors");
const getNativeRegex = require("./helpers/getNativeRegex");

const getByIdMatcher = (id) => {
  if (isPlatform("Web")) {
    throw new NotImplementedError();
  }

  if (isRegex(id)) {
    const regex = getNativeRegex(id);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `name MATCHES${regex.modifiers} '${regex.pattern}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().resourceIdMatches("${regex.modifiers}${regex.pattern}")`
      })
    });
  }

  return {
    using: "id",
    value: id
  };
};

const getByAccessibilityLabelMatcher = (accessibilityLabel) => {
  if (isPlatform("Web")) {
    throw new NotImplementedError();
  }

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
  if (isPlatform("Web")) {
    throw new NotImplementedError();
  }

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

const getByTypeMatcher = (type) => ({
  using: "class name",
  value: type
});

const getIosPredicateMatcher = (predicate) => {
  return platform.select({
    ios: () => ({
      using: "-ios predicate string",
      value: predicate
    }),
    android: () => { throw new NotImplementedError(); },
    web: () => { throw new NotImplementedError(); }
  });
};

const getUiAutomatorMatcher = (selector) => {
  return platform.select({
    ios: () => { throw new NotImplementedError(); },
    android: () => ({
      using: "-android uiautomator",
      value: selector
    }),
    web: () => { throw new NotImplementedError(); }
  });
};

// Note: Only works in a Web context.
const getByCssMatcher = (css) => {
  return platform.select({
    native: () => { throw new NotImplementedError(); },
    web: () => ({
      using: "css selector",
      value: css
    })
  });
};

module.exports = {
  id: getByIdMatcher,
  label: getByAccessibilityLabelMatcher,
  text: getByTextMatcher,
  type: getByTypeMatcher,
  iosPredicate: getIosPredicateMatcher,
  uiAutomator: getUiAutomatorMatcher,
  css: getByCssMatcher
};