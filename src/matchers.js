const commands = require("./commands");
const { platform } = require("./utils");

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
    resolve: (multiple, elementId) => {
      if (elementId) {
        const command = multiple
          ? commands.element.findElementsFromElement
          : commands.element.findElementFromElement;

        return command(elementId, getLabelQuery(accessibilityLabel));
      }

      const command = multiple
        ? commands.element.findElements
        : commands.element.findElement;

      return command(getLabelQuery(accessibilityLabel));
    }
  }),
  text: (text) => ({
    type: "text",
    value: text,
    resolve: (multiple, elementId) => {
      if (elementId) {
        const command = multiple
          ? commands.element.findElementsFromElement
          : commands.element.findElementFromElement;

        return command(elementId, getTextQuery(text));
      }

      const command = multiple
        ? commands.element.findElements
        : commands.element.findElement;

      return command(getTextQuery(text));
    }
  })
};

module.exports = {
  by
};