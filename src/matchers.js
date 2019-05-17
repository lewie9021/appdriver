const commands = require("./commands");
const { platform } = require("./utils");
const { ElementNotFoundError, ElementsNotFoundError } = require("./errors");

const isContainsQuery = (query) => {
  return query.startsWith("*") && query.endsWith("*");
};

const isEndsWithQuery = (query) => {
  return query.endsWith("*");
};

// Very crude implementation that supports simple fuzzy matching, e.g. "list-item-*" and "*item*"
// TODO: Needs to escape value to avoid unexpected behaviour.
const getLabelQuery = (accessibilityLabel) => {
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

const getTextQuery = (text) => {
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

const by = {
  id: (id) => ({
    type: "id",
    value: id,
    resolve: () => {
      return commands.element.findElement({
        using: "id",
        value: id
      })
    }
  }),
  label: (accessibilityLabel) => ({
    type: "accessibility id",
    value: accessibilityLabel,
    resolve: (multiple) => {
      const command = multiple
        ? commands.element.findElements
        : commands.element.findElement;

      return command(getLabelQuery(accessibilityLabel))
        .then((response) => {
          if (response.status) {
            if (multiple) {
              throw new ElementsNotFoundError("Failed to find elements.");
            } else {
              throw new ElementNotFoundError("Failed to find element.");
            }
          }

          return response;
        });
    }
  }),
  text: (text) => ({
    type: "text",
    value: text,
    resolve: (multiple) => {
      const command = multiple
        ? commands.element.findElements
        : commands.element.findElement;

      return command(getTextQuery(text))
        .then((response) => {
          if (response.status) {
            if (multiple) {
              throw new ElementsNotFoundError("Failed to find elements.");
            } else {
              throw new ElementNotFoundError("Failed to find element.");
            }
          }

          return response;
        });
    }
  })
};

module.exports = {
  by
};