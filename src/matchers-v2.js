const { platform } = require("./utils");

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

// Very crude implementation that supports simple fuzzy matching, e.g. "list-item-*" and "*item*"
// TODO: Needs to escape value to avoid unexpected behaviour.
const getByAccessibilityLabelMatcher = (accessibilityLabel) => {
  if (isContainsQuery(accessibilityLabel)) {
    const query = accessibilityLabel.substr(1, accessibilityLabel.length - 2);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `name CONTAINS '${query}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().descriptionContains("${query}")`
      })
    });
  }

  if (isEndsWithQuery(accessibilityLabel)) {
    const query = accessibilityLabel.substr(0, accessibilityLabel.length - 1);

    return platform.select({
      ios: () => ({
        using: "-ios predicate string",
        value: `name BEGINSWITH '${query}'`
      }),
      android: () => ({
        using: "-android uiautomator",
        value: `new UiSelector().descriptionStartsWith("${query}")`
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