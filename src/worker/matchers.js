const { platform, isRegex } = require("../utils");

const isContainsQuery = (query) => {
  return query.startsWith("*") && query.endsWith("*");
};

const isEndsWithQuery = (query) => {
  return query.endsWith("*");
};

const getByIdMatcher = (id) => ({
  using: "id",
  value: id
});

const getNativeRegex = (regex) => {
  const pattern = regex.toString();
  const flags = regex.flags.split("");

  return {
    pattern: pattern.slice(1, pattern.lastIndexOf("/")),
    modifiers: platform.select({
      ios: () => flags.includes("i")  ? "[c]" : "",
      android: () => flags.includes("i") ? "(?i)" : ""
    })
  }
};

// TODO: Needs to escape value to avoid unexpected behaviour.
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
  if (isContainsQuery(text)) {
    const query = text.substr(1, text.length - 2);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `label CONTAINS '${query}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().textContains("${query}")`
      })
    });
  }

  if (isEndsWithQuery(text)) {
    const query = text.substr(0, text.length - 1);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `label BEGINSWITH '${query}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().textStartsWith("${query}")`
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