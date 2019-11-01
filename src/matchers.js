const commands = require("./commands");
const { platform } = require("./utils");

const isContainsQuery = (query) => {
  return query.startsWith("*") && query.endsWith("*");
};

const isEndsWithQuery = (query) => {
  return query.endsWith("*");
};

const findElement = (multiple, elementId, stratagy) => {
  if (elementId) {
    const command = multiple
      ? commands.element.findElementsFromElement
      : commands.element.findElementFromElement;

    return command(elementId, stratagy);
  }

  const command = multiple
    ? commands.element.findElements
    : commands.element.findElement;

  return command(stratagy);
};

const getIdQuery = (id) => ({
  using: "id",
  value: id
});

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

// Note: only works in a Web context.
const getCssQuery = (css) => ({
  using: "css selector",
  value: css
});

const by = {
  id: (id) => ({
    type: "id",
    value: id,
    resolve: (multiple, elementId) => {
      return findElement(multiple, elementId, getIdQuery(id));
    }
  }),
  css: (css) => ({
    type: "css",
    value: css,
    resolve: (multiple, elementId) => {
      return findElement(multiple, elementId, getCssQuery(css));
    }
  }),
  label: (accessibilityLabel) => ({
    type: "accessibility id",
    value: accessibilityLabel,
    resolve: (multiple, elementId) => {
      return findElement(multiple, elementId, getLabelQuery(accessibilityLabel));
    }
  }),
  text: (text) => ({
    type: "text",
    value: text,
    resolve: (multiple, elementId) => {
      return findElement(multiple, elementId, getTextQuery(text));
    }
  })
};

module.exports = {
  by
};